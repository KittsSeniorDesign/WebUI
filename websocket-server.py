#! /usr/bin/env python3

import asyncio
import datetime
import random
import websockets
import sys
import time

print("Running version: " + str(sys.version).split()[0])

rlist = list()
number_of_robots = int(0)

async def producer():
    global number_of_robots
    send_string = str()
    if number_of_robots > 0:
        for i,robot in enumerate(rlist):
            return_value = list()
            r_vel = (random.random() - random.random()) * 200
            r_hdn = (random.random() - random.random()) * 200
            r_alt = (random.random() - random.random()) * 200
            r_lcx = (random.random() - random.random()) * 200
            r_lcy = (random.random() - random.random()) * 200
            r_lcz = (random.random() - random.random()) * 200
            n_r = i + 1
            return_value.append(n_r)
            return_value.append(r_vel)
            return_value.append(r_hdn)   
            return_value.append(r_alt)   
            return_value.append(r_lcx)   
            return_value.append(r_lcy)   
            return_value.append(r_lcz)
            rlist[i] = return_value
            send_string += '{} {:.2f} {:.2f} {:.2f} {:.2f} {:.2f} {:.2f} '.format(rlist[i][0],rlist[i][1],rlist[i][2],rlist[i][3],rlist[i][4],rlist[i][5],rlist[i][6])
        time.sleep(0.01)
        return send_string.strip()
    else:
        time.sleep(0.01)
        return '0 0 0 0 0 0 0'
    
    

async def consumer(message):
    if 'Number of Robots: ' in message:
        add_robot()
    else:
        print(message)
        
def add_robot():
    global number_of_robots
    return_value = list()
    r_vel = float(0)
    r_hdn = float(0)
    r_alt = float(0)
    r_lcx = float(0)
    r_lcy = float(0)
    r_lcz = float(0)
    n_r = round(random.random() * number_of_robots)
    return_value.append(n_r)
    return_value.append(r_vel)
    return_value.append(r_hdn)   
    return_value.append(r_alt)   
    return_value.append(r_lcx)   
    return_value.append(r_lcy)   
    return_value.append(r_lcz)
    rlist.append(return_value)
    number_of_robots += 1
    
async def handler(websocket, path):
    while True:
        listener_task = asyncio.ensure_future(websocket.recv())
        producer_task = asyncio.ensure_future(producer())
        done, pending = await asyncio.wait(
            [listener_task, producer_task],
            return_when=asyncio.FIRST_COMPLETED)

        if listener_task in done:
            message = listener_task.result()
            await consumer(message)
        else:
            listener_task.cancel()

        if producer_task in done:
            message = producer_task.result()
            await websocket.send(message)
        else:
            producer_task.cancel()

start_server = websockets.serve(handler, '127.0.0.1', 5678)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
                
