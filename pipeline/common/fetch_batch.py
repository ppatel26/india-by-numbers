"""Download a list of publisher URLs, each into its own new folder.
Usage: python3 -I pipeline/common/fetch_batch.py --raw raw/<topic>/<folder> < list.tsv
Each input line is "<key><TAB><url>". For each line the script makes <raw>/<key>-XXXXXXXX/ with
`body` (the file), `headers` (the HTTP response headers) and `url`, and prints key, folder, sha256 and status."""
import argparse
import concurrent.futures
import hashlib
from pathlib import Path
import subprocess
import sys
import tempfile

ap = argparse.ArgumentParser()
ap.add_argument('--raw', required=True, help='folder for the downloads')
RAW = Path(ap.parse_args().raw)
RAW.mkdir(parents=True, exist_ok=True)

def fetch(entry):
    key, url = entry
    directory = Path(tempfile.mkdtemp(prefix=key + '-', dir=RAW))
    body = directory / 'body'
    result = subprocess.run(['curl','-sSL','--connect-timeout','8','--max-time','32','--max-filesize','100000000','-A','Mozilla/5.0','-D',str(directory/'headers'),'-o',str(body),'-w','%{http_code} %{content_type} %{url_effective}',url],capture_output=True,text=True)
    (directory/'url').write_text(url)
    digest = hashlib.sha256(body.read_bytes()).hexdigest() if body.is_file() else '-'
    return f'{key}\t{directory}\t{digest}\t{result.stdout} {result.stderr.strip()}'

entries = [line.rstrip('\n').split('\t',1) for line in sys.stdin if line.strip()]
with concurrent.futures.ThreadPoolExecutor(max_workers=18) as pool:
    for result in pool.map(fetch,entries):
        print(result,flush=True)
