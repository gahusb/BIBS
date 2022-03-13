import struct, hashlib, time
import binascii
import os
from Cryto.Cipher import AES

def decrypt_file(key, in_filename, out_filename, chunksize = 24*1024):
    with open(in_filename, 'rb') as infile:
        origsize = struct.unpack('<Q',infile.read(struct.calcsize('Q')))[0]
        iv = infile.read(16)
        decryptor = AES.new(key,AES.MODE_CBC,iv)
        with open(out_filename,'wb') as outfile:
            while True:
                chunk  = infile.read(chunksize)
                if len(chunk) == 0:
                    break
                outfile.write(decryptor.decrypt(chunk))
            outfile.truncate(origsize)