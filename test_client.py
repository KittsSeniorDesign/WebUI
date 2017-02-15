#! /usr/bin/env python3

import socket
import sys
import multiprocessing

class Server(multiprocessing.Process):
    def __init__(self):
        super(Server,self).__init__()
        self.sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.ip = 'localhost'
        self.port = 9002
        self.address = (self.ip,self.port)
        self.sock.connect(self.address)
        self.sock.setblocking(0)
    
    def run(self):
        ds = DataServer(self.sock)
        cs = ConfigServer(self.sock)
        ds.start()
        cs.start()
        
class DataServer(multiprocessing.Process):
    def __init__(self,connection):
        super(DataServer,self).__init__()
        self.connection = connection
    
    def run(self):
        try:
            while True:
                try:
                    data = self.connection.recv(1024)
                    if data:
                        print(data)
                except Exception as e:
                    # print("Error has occured: " + str(type(e)))
                    pass
        except Exception as e:
            print("TCP Server Shutting Down... " + str(type(e)))
            self.connection.close()
            sys.exit(1)

class ConfigServer(multiprocessing.Process):
    def __init__(self,connection):
        super(ConfigServer,self).__init__()
        self.connection = connection
        
    def run(self):
        try:
            while True:
                try:
                    config = raw_input("send: ")
                    if config:
                        print(config)
                        self.connection.send(config)
                except Exception as e:
                    # print("Error has occured: " + str(type(e)))
                    pass
        except Exception as e:
            print("TCP Server Shutting Down... " + str(type(e)))
            self.connection.close()
            sys.exit(1)

if __name__ == '__main__':
    s = Server()
    s.start()