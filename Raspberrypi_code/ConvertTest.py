import base64

with open('./alwaysMode/a2.mp4','rb') as VF:
    #str = base64.b64encode(VF.read())
    f = VF.read()
    b = bytearray(f)
    print len(b)