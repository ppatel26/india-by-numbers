"""List Ministry of Law and Justice answers in Parliament, with their files, to find pendency tables.

Lok Sabha: searches the Lok Sabha eLibrary (DSpace API behind sansad.in/ls/questions).
Rajya Sabha: reads the question list of one session from rsdoc.nic.in (the API behind sansad.in/rs/questions).

Usage:
  python3 -I pipeline/crime/find_answers.py ls "<search words>" <since YYYY-MM-DD> <out.tsv>
  python3 -I pipeline/crime/find_answers.py rs <session number, for example 271> <title word> <out.tsv>
Columns of out.tsv: answer date, question number, type, title, file URLs.
"""
import json
import sys
import urllib.parse
import urllib.request

UA = 'IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)'
LS_SCOPE = '75228d43-3a98-4b7d-b90f-ffec6aa9fa11'


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/json'})
    return json.load(urllib.request.urlopen(req, timeout=60))


def lok_sabha(query, since):
    rows = []
    for page in range(10):
        u = 'https://elibrary.sansad.in/server/api/discover/search/objects?' + urllib.parse.urlencode(
            {'query': query, 'sort': 'dc.date.issued,DESC', 'size': 50, 'page': page, 'scope': LS_SCOPE})
        d = get(u)['_embedded']['searchResult']
        stop = False
        for o in d['_embedded']['objects']:
            it = o['_embedded']['indexableObject']
            md = it['metadata']
            g = lambda k: '; '.join(v['value'] for v in md.get(k, []))
            if g('dc.date.issued') < since:
                stop = True
                continue
            if 'LAW' not in g('dc.relation.ministry'):
                continue
            files = []
            for b in get(it['_links']['bundles']['href'])['_embedded']['bundles']:
                if b['name'] == 'ORIGINAL':
                    for f in get(b['_links']['bitstreams']['href'])['_embedded']['bitstreams']:
                        files.append(f['name'] + '=' + f['_links']['content']['href'])
            rows.append([g('dc.date.issued'), g('dc.identifier.questionnumber'), g('dc.identifier.questiontype'),
                         g('dc.title'), ' '.join(files)])
        if stop or page + 1 >= d['page']['totalPages']:
            break
    return rows


def rajya_sabha(session, word):
    d = get('https://rsdoc.nic.in/Question/Search_Questions?whereclause=ses_no=' + urllib.parse.quote(session))
    return [[q['ans_date'], str(q['qno']).split('.')[0], q['qtype'].strip(), q['qtitle'].strip(), q.get('files') or '']
            for q in d if 'LAW' in (q.get('min_name') or '').upper() and word.lower() in (q.get('qtitle') or '').lower()]


def main():
    if len(sys.argv) != 5 or sys.argv[1] not in ('ls', 'rs'):
        sys.exit(__doc__)
    house, a, b, out = sys.argv[1:]
    rows = lok_sabha(a, b) if house == 'ls' else rajya_sabha(a, b)
    with open(out, 'w') as f:
        for r in rows:
            f.write('\t'.join(r) + '\n')
    print(f'{len(rows)} answers written to {out}')


if __name__ == '__main__':
    main()
