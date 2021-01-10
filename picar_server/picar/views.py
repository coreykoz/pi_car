from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.http import Http404

import io
import picamera
import logging
from threading import Condition
import codecs

class StreamingOutput(object):
    def __init__(self):
        self.frame = None
        self.buffer = io.BytesIO()
        self.condition = Condition()

    def write(self, buf):
        if buf.startswith(b'\xff\xd8'):
            # New frame, copy the existing buffer's content and notify all
            # clients it's available
            self.buffer.truncate()
            with self.condition:
                self.frame = self.buffer.getvalue()
                self.condition.notify_all()
            self.buffer.seek(0)
        return self.buffer.write(buf)

with picamera.PiCamera(resolution='640x480', framerate=24) as camera:
        output = StreamingOutput()
        #Uncomment the next line to change your Pi's Camera rotation (in degrees)
        #camera.rotation = 90
        camera.start_recording(output, format='mjpeg')
        print("camera established")

def index(request):
    response = HttpResponse()
    template = loader.get_template('picar/index.html')
    response['Content-Type'] = 'text/html'
    response['Content-Length'] = len(template)
    return render(request, response)

def videoStream(request):
    response = HttpResponse()
    response['Age'] = 0
    response['Cache-Control'] = 'no-cache, private'
    response['Pragma'] = 'no-cache'
    response['Content-Type'] = 'multipart/x-mixed-replace; boundary=FRAME'
    print("initial response headers printed")
    try:
        print("entered try")
        while True:
            print("entered while loop")
            with output.condition:
                output.condition.wait()
                frame = output.frame
                print("updated frame")
            response.write(b'--FRAME\r\n')
            response['Content-Type'] = 'text/html'
            response['Content-Length'] = len(frame)
            response.write(frame)
            response.write(b'\r\n')
            print(response)
            return response
    except:
        print("An exception occurred")
    