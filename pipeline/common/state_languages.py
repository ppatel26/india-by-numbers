"""Write research/data/state-languages.csv: official languages, display script and native name of each state and UT.
The values are entered here by hand from the sources named in each row. Nothing is downloaded.
Usage: python3 -I pipeline/common/state_languages.py [--out research/data]
"""
from pathlib import Path
import argparse
import csv
import unicodedata

ap = argparse.ArgumentParser()
ap.add_argument('--out', default='research/data', help='folder with geography.csv; state-languages.csv is written here')
root = Path(ap.parse_args().out)
clm = 'https://web.archive.org/web/20171011124847id_/http://nclm.nic.in/shared/linkimages/NCLM52ndReport.pdf'
sik_act = 'https://web.archive.org/web/20180722164022id_/https://www.sikkim.gov.in/stateportal/UsefulLinks/Gazette1977.pdf'
pdy_act = 'https://web.archive.org/web/20240315060504id_/https://law.py.gov.in/docs/Code1.pdf'
goa_act = 'https://www.goa.gov.in/department/official-language/'

entries = {}

def add(slug, laws, display, script, native, hindi, source, note=''):
    assert slug not in entries
    entries[slug] = (laws, display, script, native, source, note, hindi)

add('andhra-pradesh','Telugu;Urdu;English','Telugu','Telugu','ఆంధ్రప్రదేశ్','आंध्र प्रदेश',
    'https://visakhapatnam.ap.gov.in/te/',
    f'CLM chapter 32 records Telugu and Urdu. English continues for specified purposes. {clm}#page=120')
add('arunachal-pradesh','English','English','Latin','','अरुणाचल प्रदेश',
    f'{clm}#page=59','The administration reported English. The English name serves as the display name.')
add('assam','Assamese;Bodo;Bengali;English','Assamese','Bengali','অসম','असम',
    'https://web.archive.org/web/20250306211055id_/https://assam.gov.in/as',
    'Bodo is an associate official language. Bengali applies in the Barak Valley. English continues for specified purposes.')
add('bihar','Hindi;Urdu','Hindi','Devanagari','बिहार','बिहार',
    'https://patna.nic.in/hi/',f'CLM chapter 9 records Urdu as an additional official language. {clm}#page=41')
add('chhattisgarh','Hindi;Chhattisgarhi','Hindi','Devanagari','छत्तीसगढ़','छत्तीसगढ़',
    'https://cgstate.gov.in/hi','Chhattisgarhi has official status. The state portal uses Hindi for its title.')
add('goa','Konkani','Konkani','Devanagari','गोंय','गोवा',
    'https://www.goa.gov.in/?lang=kok',f'The 1987 Act names Konkani as the official language and permits Marathi for official purposes. Section 4 provides for continued use of English. {goa_act}')
add('gujarat','Gujarati;Hindi','Gujarati','Gujarati','ગુજરાત','गुजरात',
    'https://gandhinagar.nic.in/gu/','Section 2 of the Gujarat Official Languages Act authorises Gujarati and Hindi. The district portal uses Gujarati for the state name.')
add('haryana','Hindi;Punjabi;English','Hindi','Devanagari','हरियाणा','हरियाणा',
    'https://www.haryana.gov.in/',f'Punjabi is the second language under the 2010 amendment. The CLM records the continued use of English. {clm}#page=29')
add('himachal-pradesh','Hindi;Sanskrit','Hindi','Devanagari','हिमाचल प्रदेश','हिमाचल प्रदेश',
    'https://hpshimla.nic.in/hi/','The 2019 amendment adds Sanskrit as the second official language.')
add('jharkhand','Hindi;Angika;Bengali;Bhojpuri;Bhumij;Ho;Kharia;Khortha;Kurmali;Kurukh;Magahi;Maithili;Mundari;Nagpuri;Odia;Santali;Urdu',
    'Hindi','Devanagari','झारखंड','झारखंड','https://ranchi.nic.in/hi/',
    'Hindi is the first official language. The CLM report predates later language additions. The current list needs a check against the consolidated state Act.')
add('karnataka','Kannada','Kannada','Kannada','ಕರ್ನಾಟಕ','कर्नाटक',
    'https://bengaluruurban.nic.in/en/covid-19/know-your-covid-19-test-result/',
    f'The district portal uses Kannada for state branding. CLM chapter 29 records Kannada. {clm}#page=104')
add('kerala','Malayalam;English','Malayalam','Malayalam','കേരളം','केरल',
    'https://kerala.gov.in/','The state portal writes the Malayalam name as shown. English may also be used for official purposes.')
add('madhya-pradesh','Hindi','Hindi','Devanagari','मध्य प्रदेश','मध्य प्रदेश',
    'https://bhopal.nic.in/en/history/',f'The district portal uses Hindi for state branding. CLM chapter 12 records Hindi. {clm}#page=50')
add('maharashtra','Marathi','Marathi','Devanagari','महाराष्ट्र','महाराष्ट्र',
    'https://maharashtra.gov.in/',f'CLM chapter 30 records Marathi. {clm}#page=113')
add('manipur','Manipuri;English','Manipuri','Meetei Mayek','ꯃꯅꯤꯄꯨꯔ','मणिपुर',
    'https://manipurgovtpress.nic.in/media/gazzete/EOG_427_10-03-2021.pdf',
    'The 2021 amendment defines Manipuri as Meeteilon in Meetei Mayek and allows concurrent Bengali script for up to ten years from 10 Mar 2021. The state language directorate uses the displayed spelling on page 10 of its Manipuri course reader. https://web.archive.org/web/20240921020413id_/https://dlpi.mn.gov.in/media/filer_public/6c/c4/6cc49b48-7b45-4415-a866-9f64297a7e5c/bcom1stsem___mil.pdf#page=10')
add('meghalaya','English;Khasi;Garo','English','Latin','','मेघालय',
    f'{clm}#page=71',
    'The 2026 ordinance names English, Khasi and Garo. I could not locate its commencement notice or a replacement Act. The display name uses Latin script. https://newsonair.gov.in/meghalaya-declares-khasi-and-garo-as-official-languages-alongside-english/')
add('mizoram','Mizo;English','Mizo','Latin','','मिजोरम',
    f'{clm}#page=73','The 1974 state Act names Mizo and allows continued use of English. The CLM report also lists Hindi. Mizo uses Latin script.')
add('nagaland','English','English','Latin','','नागालैंड',
    f'{clm}#page=78','The English name serves as the display name.')
add('odisha','Odia','Odia','Oriya','ଓଡ଼ିଶା','ओडिशा',
    'https://cm.odisha.gov.in/',f'The Chief Minister portal uses Odia. Unicode calls the script Oriya. {clm}#page=80')
add('punjab','Punjabi','Punjabi','Gurmukhi','ਪੰਜਾਬ','पंजाब',
    'https://amritsar.nic.in/pa/',f'CLM chapter 7 specifies Gurmukhi. {clm}#page=37')
add('rajasthan','Hindi;English','Hindi','Devanagari','राजस्थान','राजस्थान',
    f'{clm}#page=39','The CLM records Hindi and the additional use of English.')
add('sikkim','Nepali;Bhutia;Lepcha;Limboo;Gurung;Mangar;Mukhia;Newari;Rai;Sherpa;Tamang;English',
    'Nepali','Devanagari','सिक्किम','सिक्किम',
    'https://ipr.sikkim.gov.in/documents/nepali/1e084acc-f8d1-4500-9b05-4c48a86a9eff_SIKKIM%20HERALD%20nepali%20special%201_compressed.pdf',
    f'The 1977 Act names Nepali, Bhutia and Lepcha and allows continued use of English. The list includes later additions. The consolidated amendments need a check. {sik_act}')
add('tamil-nadu','Tamil;English','Tamil','Tamil','தமிழ்நாடு','तमिलनाडु',
    'https://chennai.nic.in/ta/',f'English continues for communication. CLM chapter 36 records Tamil and that use of English. {clm}#page=137')
add('telangana','Telugu;Urdu','Telugu','Telugu','తెలంగాణ','तेलंगाना',
    'https://www.telangana.gov.in/','The 2017 amendment made Urdu the second official language across the state. The state portal uses Telugu in its press releases.')
add('tripura','Bengali;English;Kokborok','Bengali','Bengali','ত্রিপুরা','त्रिपुरा',
    'https://khowai.nic.in/bn/',f'CLM section 23.2 lists all three languages. The Khowai district portal uses the Bengali state name. {clm}#page=84')
add('uttar-pradesh','Hindi;Urdu','Hindi','Devanagari','उत्तर प्रदेश','उत्तर प्रदेश',
    'https://lucknow.nic.in/hi/',f'The 1989 amendment provides for Urdu as a second official language for specified purposes. {clm}#page=54')
add('uttarakhand','Hindi;Sanskrit','Hindi','Devanagari','उत्तराखंड','उत्तराखंड',
    'https://dehradun.nic.in/hi/','The 2010 state Act gives Sanskrit second official language status.')
add('west-bengal','Bengali;English;Nepali;Urdu;Hindi;Odia;Santali;Punjabi;Kamtapuri;Rajbanshi;Kurmali;Kurukh;Telugu',
    'Bengali','Bengali','পশ্চিমবঙ্গ','पश्चिम बंगाल','https://howrah.gov.in/bn/',
    'The district site uses Bengali for state branding. Several additional languages apply only in specified areas. The consolidated amendments need a check.')
add('andaman-nicobar','Hindi;English','Hindi','Devanagari','अंडमान और निकोबार द्वीप समूह','अंडमान और निकोबार द्वीपसमूह',
    'https://southandaman.nic.in/hi/',f'CLM section 31.3 records Hindi and English. The district portal uses this Hindi form for the territory. {clm}#page=115')
add('chandigarh','English','English','Latin','','चंडीगढ़',
    f'{clm}#page=13','CLM section 2.3 names English. The English name serves as the display name.')
add('dnh-dd','Hindi;Gujarati','Gujarati','Gujarati','દાદરા અને નગર હવેલી અને દમણ અને દીવ','दादरा और नगर हवेली एवं दमन और दीव',
    'https://ddd.gov.in/gu/',f'The merged UT uses Gujarati in its title. CLM sections 25.2 and 26.2 describe the former UTs and flag uncertainty about Konkani in Daman and Diu. A post-merger language notice was not found. {clm}#page=92')
add('delhi','Hindi;Punjabi;Urdu;English','Hindi','Devanagari','दिल्ली','दिल्ली',
    'https://delhi.gov.in/hi',f'Punjabi and Urdu have second official language status. English continues for official purposes. {clm}#page=18')
add('jammu-kashmir','Kashmiri;Dogri;Urdu;Hindi;English','Urdu','Arabic','جموں و کشمیر','जम्मू और कश्मीर',
    'https://srinagar.nic.in/ur/',
    'The UT name appears in Urdu in the government branding on the Srinagar district portal. Section 3 of the 2020 Act lists all five languages. https://egazette.gov.in/WriteReadData/2020/222037.pdf')
add('ladakh','English;Hindi;Urdu;Bhoti;Purgi','Hindi','Devanagari','लद्दाख','लद्दाख',
    'https://ladakh.gov.in/',
    'The UT masthead uses this Hindi form. Section 3 of the 2025 regulation names all five languages and provides for a start date by notice. https://egazette.gov.in/WriteReadData/2025/263538.pdf')
add('lakshadweep','English','English','Latin','','लक्षद्वीप',
    f'{clm}#page=129','CLM section 34.2 names English. Malayalam is widely spoken. The English name serves as the display name.')
add('puducherry','Tamil;Malayalam;Telugu;English','Tamil','Tamil','புதுச்சேரி','पुडुचेरी',
    'https://puducherry-dt.gov.in/ta/',
    f'The 1965 Act names Tamil, allows Malayalam for Mahe and Telugu for Yanam, and permits English for official purposes. {pdy_act}')

with (root/'geography.csv').open(newline='') as file:
    geography = list(csv.DictReader(file))
assert set(entries) == {r['slug'] for r in geography}
with (root/'state-languages.csv').open('w',newline='') as file:
    writer = csv.writer(file,lineterminator='\n')
    writer.writerow(['slug','name','official_languages','display_language','script','native_name','source_url','note','hindi_name'])
    for row in geography:
        writer.writerow(unicodedata.normalize('NFC',value) for value in [row['slug'],row['name'],*entries[row['slug']]])
print(len(entries))
