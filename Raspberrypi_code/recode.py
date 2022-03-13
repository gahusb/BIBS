#!/usr/bin/env python
import picamera
import time
import os
import glob
import RPi.GPIO as GPIO
import time
import threading
import requests
import json
import base64
from gps import *


GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.IN, pull_up_down=GPIO.PUD_UP)

accident_flag = False
transfer_flag = False
record_flag = False
stop_flag = False
transfer_stop_flag = False
accident_time = ""
count = int(0)
count1 = int(0)
count2 = int(0)
lon = 0.01
lat = 0.02
time_list = [[0 for rows in range(2)]for cols in range(10)]
gpsd = None

class GpsPoller(threading.Thread):
  def __init__(self):
    threading.Thread.__init__(self)
    global gpsd
    gpsd = gps(mode=WATCH_ENABLE) #starting the stream of info
    self.current_value = None
    self.running = True #setting the thread running to true
 
  def run(self):
    global gpsd
    while gpsp.running:
      gpsd.next() #this will continue to loop and grab EACH set of gpsd info to clear the buffer

def push_button(channel):
    print "Interrupt!"
    global accident_flag
    global accident_time
    accident_flag = True
    now = time.localtime()
    str = "%04d-%02d-%02d-%02d-%02d-%02d" % (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec) 
    accident_time = str
    print accident_flag

# add Button event
GPIO.add_event_detect(11, GPIO.FALLING, callback=push_button)

def record():
    global accident_flag
    global transfer_flag
    global record_flag
    global count
    global count1
    global count2
    global time_list
    global accident_time
    global stop_flag
    global gpsd
    global lon
    global lat
    count = int(0)
    count1 = int(0)
    count2 = int(0)
    before = False
    calc_time = int(0)
    with picamera.PiCamera() as camera:
   camera.resolution = (640, 480)
   while True:
            if stop_flag == True:
                print "STOP!!"
                camera.stop_recording()
                camera.stop_preview()
                break
            #starttime   
            now = time.localtime()
            str = "%04d-%02d-%02d-%02d-%02d-%02d" % (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)      
            start_str = str   
            time_list[count][0] = start_str
                    
            chara = 'alwaysMode/' + chr((int(count) % 10) + 97) + '.h264' 
            camera.start_preview()
            camera.start_recording(chara)
            camera.wait_recording(30)
            camera.stop_recording()
            camera.stop_preview()
                    
            #endtime
            now = time.localtime()
            str = "%04d-%02d-%02d-%02d-%02d-%02d" % (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            end_str = str
            time_list[count][1] = end_str
                            
            if transfer_flag == True:
                count2 = int(count)
                record_flag = True
            elif accident_flag == True:
                m_start = start_str[14:16]
                s_start = start_str[17:19]
                m_acc = accident_time[14:16]
                s_acc = accident_time[17:19]
                if m_start == m_acc:
                    calc_time = int(s_acc) - int(s_start)
                    if(calc_time <= 15):
                        before = True
                else:
                    calc_time = int(s_acc) + 60 - int(s_start)
                    if(calc_time <= 15):
                        before = True
                if before == True:
                    before = False
                    if int(count) == 0:
                        count1 = int(9) % 10
                        count2 = int(0) % 10
                    else:
                        count1 = (int(count) - 1) % 10 
                        count2 = int(count) % 10
                    accident_flag = False
                    record_flag = True
                else:
                    count1 = int(count)                
                    transfer_flag = True
                
            count = count + 1
            count = count % 10
            
            
def transfer_Video():
    global accident_flag
    global transfer_flag
    global record_flag
    global accident_time
    global count1
    global count2
    global time_list
    global files_list
    global lon
    global lat
    url = "http://192.168.255.182:8000"
    while True:
        str = ""
        str2 = ""
        if transfer_stop_flag == True:
            break
        if record_flag == True:
            print "count1 : %d" % count1
            print "count2 : %d" % count2
            accident_flag = False
            accident_flag2 = False
            transfer_flag = False
            record_flag = False
            if int(count2) == int(0):
                str = './alwaysMode/j.h264'
                str2 = './alwaysMode/a.h264'
                values = {'video1_start_time' : time_list[9][0],
                            'video1_end_time' : time_list[9][1],
                            'video2_start_time' : time_list[0][0],
                            'video2_end_time' : time_list[0][1],
                            'accident_time' : accident_time,
                            'longitude' : 126.864980,
                            'latitude' : 37.600548,
                            'id' : "sherry92",
                            'carName' : "sonata",
                            'carNumber' : '4117',
                            'first_file_name' : chr((int(count1) % 10) + 97) + '.h264',
                            'second_file_name' : chr((int(count2) % 10) + 97) + '.h264'}
            else:
                str = './alwaysMode/' + chr((int(count1) % 10) + 97) + '.h264'
                str2 = './alwaysMode/' + chr((int(count2) % 10) + 97) + '.h264'
                values = {'video1_start_time' : time_list[count1][0],
                            'video1_end_time' : time_list[count1][1],
                            'video2_start_time' : time_list[count2][0],
                            'video2_end_time' : time_list[count2][1],
                            'accident_time' : accident_time,
                            'longitude' : 126.864980,
                            'latitude' : 37.600548,
                            'id' : "sherry92",
                            'carName' : "sonata",
                            'carNumber' : '4117',
                            'first_file_name' : chr((int(count1) % 10) + 97) + '.h264',
                            'second_file_name' : chr((int(count2) % 10) + 97) + '.h264'}
                    
            files = {'video1' : open(str, 'rb'), 'video2' : open(str2, 'rb')}
            print "OK"
            now = time.localtime()
            str = "%04d-%02d-%02d-%02d-%02d-%02d" % (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            print "Transfer Start at : " + str
            r = requests.post(url, files = files, data = values)
            now = time.localtime()
            str = "%04d-%02d-%02d-%02d-%02d-%02d" % (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
            print "Transfer End at : " + str            
            print r
        time.sleep(1)
        
            
if __name__== "__main__":
    global stop_flag
    global transfer_stop_flag
#    gpsp = GpsPoller()
    recordTh = threading.Thread(target = record)
    transferTh = threading.Thread(target = transfer_Video)
    recordTh.start()
    transferTh.start()
#    gpsp.start()

    while True:
        try:
          time.sleep(100)
        except KeyboardInterrupt:
            print "Ctrl-c received! Sending kill to threads.."
            stop_flag = True
            transfer_stop_flag = True
#            gpsp.running = False
            recordTh.wait()
            transferTh.wait()
#            gpsp.wait()
            print "stop...."
            break