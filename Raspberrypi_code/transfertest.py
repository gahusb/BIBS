import requests
import json
import base64
import time

url = "http://192.168.197.128:8000"
files = {'content' : open('./alwaysMode/a.mp4'.'rb')}
print "OK1"
values = {'msg' : 'Are you alive?'}
print "OK2"
now = time.localtime()
str = "%04d-%02d-%02d-%02d-%02d-02d" % (now.tm_year, now.tm._mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
print files

#r = requests.post(url, files = files, data = values)
now = time.lacaltime()
#str = "%04d-%02d-%02d-%02d-%02d-02d" % (now.tm_year, now.tm._mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
#print str
#print r