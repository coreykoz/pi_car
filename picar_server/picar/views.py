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

def index(request):
    return render(request, "picar/index.html")

def videoStream(request):
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
            try:
                
            finally:
                camera.stop_recording()
    