import pandas as pd
from pandas_datareader import data
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from get_corp_data import download_stock_codes


cred = credentials.Certificate(
    "C:/Users/youji/Documents/kor_stock_app/corp_code/kor-stock-app-firebase-adminsdk-le843-dbfdee24df.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


def read_stock_data(corp_name, start='2020-10-01', end='2020-10-15'):
    docs = db.collection(u'corp_codes').where(
        'corp_name', '==', corp_name).stream()

    for doc in docs:
        doc = doc.to_dict()
        corp_code = doc['corp_code']
        corp_name = doc['corp_name']
        break
    df = data.DataReader(corp_code, 'yahoo', start, end)
    # high, low, open, close, volume, adj close

    return df


def update_corp_data():
    result = {}
    kospi_codes = download_stock_codes('kospi')
    kosdaq_codes = download_stock_codes('kosdaq')
    kospi_result = kospi_codes.to_dict()['종목코드']
    kosdaq_result = kosdaq_codes.to_dict()['종목코드']
    for dict in kospi_result:
        result[dict] = kospi_result[dict]+'.KS'
    for dict in kosdaq_result:
        result[dict] = kosdaq_result[dict]+'.KQ'
    with open('corp_codes.json', 'w', encoding='utf-8') as make_file:
        json.dump(result, make_file, ensure_ascii=False, indent='\t')

    with open("corp_codes.json", 'rt', encoding='utf-8') as json_file:
        items = json.load(json_file)
        for item in items:
            doc_ref = db.collection(u'corp_codes').document()
            doc_ref.set(
                {u'corp_name': item, u'corp_code': items[item]})


# update_corp_data()
