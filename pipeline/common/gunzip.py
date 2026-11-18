"""Copy a file, and decompress it first if it is gzip data (some archived pages are stored gzipped).
Usage: python3 -I pipeline/common/gunzip.py <in> <out>"""
import gzip, sys
b = open(sys.argv[1], 'rb').read()
if b[:2] == b'\x1f\x8b': b = gzip.decompress(b)
open(sys.argv[2], 'wb').write(b)
