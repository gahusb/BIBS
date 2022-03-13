import Rpi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

GPIO.setup(11,GPIO.IN, pull_up_down = GPIO.PUD_UP)

def push_button(channel):
    print "Interrupt!"

GPIO.add_event_detect(11,GPIO.FALLING, callback=push_button)

while True:
#   print "waiting..."
    input_state = GPIO.input(11)
    print input_state
#   if input_state == False:
#        button down
#       print "FAlSE"
#   else:
#       button up
#       print "TRUE"
    time.sleep(1)
    