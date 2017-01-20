#! /usr/bin/env python3

import asyncio
import datetime
import random
import websockets
import sys

print("Running version: " + str(sys.version).split()[0])

rlist = list()
number_of_robots = int(0)

def robot_simulator():
    global number_of_robots
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
    
async def time(websocket, path):
    while True:
        if number_of_robots == 0:
            add_robot()
        robot_simulator()
        for i,robot in enumerate(rlist):
            send_string = "{} {:.2f} {:.2f} {:.2f} {:.2f} {:.2f} {:.2f}".format(rlist[i][0],rlist[i][1],rlist[i][2],rlist[i][3],rlist[i][4],rlist[i][5],rlist[i][6])
            # print("Sending: " + send_string)
            await websocket.send(send_string)
        # time_to_sleep = random.random() * 0.0001;
        # await asyncio.sleep(time_to_sleep)
        # if time_to_sleep > 0:
        if number_of_robots < 10:
            add_robot();
        msg = await websocket.recv()
        if msg:
            print(msg)
start_server = websockets.serve(time, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()