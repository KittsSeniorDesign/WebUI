#! /usr/bin/env python3

# start matlab (in windows) when config is received

import asyncio
import websockets
import socket
import sys
import multiprocessing

class Server(multiprocessing.Process):
    def __init__(self,data_queue,config_queue):
        super(Server,self).__init__()
        self.sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.ip = '0.0.0.0'
        self.port = 9002
        self.address = (self.ip,self.port)
        self.number_of_connections = 1
        try:
            self.sock.bind(self.address)
        except Exception as error:
            print('[FAIL] Socket: ' + str(type(error)))
            sys.exit(1)
        self.sock.listen(self.number_of_connections)
        self.matlab_connection = self.acquire_connection_tcp('MATLAB')
        self.sock.setblocking(0)
        self.data_queue = data_queue
        self.config_queue = config_queue
        
    def acquire_connection_tcp(self,connection):
        try:
            print('[ .. ] MATLAB')
            # print('Waiting for {} to connect'.format(connection))
            temp_conn, temp_addr = self.sock.accept()
            print('[ OK ] MATLAB')
            # print('{}:{} has connected'.format(*temp_addr))
            return temp_conn
        except KeyboardInterrupt:
            sys.exit(1)
    
    def run(self):
        ds = DataServer(self.data_queue,self.matlab_connection)
        cs = ConfigServer(self.config_queue,self.matlab_connection)
        ds.start()
        cs.start()
        
class DataServer(multiprocessing.Process):
    def __init__(self,data_queue,connection):
        super(DataServer,self).__init__()
        self.data_queue = data_queue
        self.connection = connection
        print("[ OK ] DataServer")
    
    def run(self):
        try:
            while True:
                try:
                    data = self.connection.recv(1024)
                    if data:
                        self.data_queue.put(data)
                except Exception as e:
                    # print("Error has occured: " + str(type(e)))
                    pass
        except Exception as e:
            print("[FAIL] DataServer: " + str(type(e)))
            self.connection.close()
            sys.exit(1)

class ConfigServer(multiprocessing.Process):
    def __init__(self,config_queue,connection):
        super(ConfigServer,self).__init__()
        self.config_queue = config_queue
        self.connection = connection
        print("[ OK ] ConfigServer")
        
    def run(self):
        try:
            while True:
                try:
                    config = self.config_queue.get_nowait()
                    if config:
                        self.matlab_connection.send(config)
                except Exception as e:
                    # print("Error has occured: " + str(type(e)))
                    pass
        except Exception as e:
            print("[FAIL] DataServer: " + str(type(e)))
            self.connection.close()
            sys.exit(1)
                
class Websocket(multiprocessing.Process):
    def __init__(self,data_queue,config_queue):
        super(Websocket, self).__init__()
        try:
            self.websocket = websockets.serve(self.handler, '127.0.0.1', 5678)
            print('[ OK ] Websocket')
        except Exception as error:
            print("[FAIL] Websocket: " + str(type(error)))
            sys.exit(1)
        self.number_of_robots = int(0)
        self.rlist = list()
        self.data_queue = data_queue
        self.config_queue = config_queue
        
    def run(self):
        asyncio.get_event_loop().run_until_complete(self.websocket)
        asyncio.get_event_loop().run_forever()
        
    async def producer(self):
        try:
            data = self.data_queue.get_nowait()
            if data:
                return data
        except Exception as error:
            return

    async def consumer(self,message):
        if 'Connection established!' in message:
            print('[ OK ] Webpage')
        self.config_queue.put(message)
        
    async def handler(self,websocket,path):
        while True:
            try:
                listener_task = asyncio.ensure_future(websocket.recv())
                producer_task = asyncio.ensure_future(self.producer())
                done, pending = await asyncio.wait(
                    [listener_task, producer_task],
                    return_when=asyncio.FIRST_COMPLETED)
                if listener_task in done:
                    message = listener_task.result()
                    if message:
                        await self.consumer(message)
                else:
                    listener_task.cancel()
                if producer_task in done:
                    message = producer_task.result()
                    if message:
                        await websocket.send(message)
                else:
                    producer_task.cancel()
            except Exception as error:
                print('[FAIL] Websocket: ' + str(type(error)))
                pass
                
if __name__ == '__main__':
    version = str(sys.version).split()[0]
    if '3' in version[0]:
        print('[ OK ] Version')
    else:
        print('[FAIL] Version')
        sys.exit(1)
    data_queue = multiprocessing.Queue()
    config_queue = multiprocessing.Queue()
    w = Websocket(data_queue,config_queue)
    s = Server(data_queue,config_queue)
    w.start()
    s.start()