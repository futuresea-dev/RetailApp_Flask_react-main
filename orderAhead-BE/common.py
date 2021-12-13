import os
from passlib.hash import pbkdf2_sha256 as sha256
from random import randint
import urllib
from slugify import slugify
import json
from pathlib import Path
from shutil import copyfile



def generate_hash(password):
    return sha256.hash(password)


def verify_hash(password, hash_):
    return sha256.verify(password, hash_)


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def get_verification_code():
    return randint(1000000, 9999999)

def sanitize_title(text):
    # return urllib.parse.quote(text, safe='')
    return text

def sanitize_handle(text):
    return slugify(text)

def fix_quote(text):
    return json.dumps(text)

def get_frontend_dir(relative_path = ''):
    return os.path.dirname(os.path.realpath(__file__)) + '/../orderAhead-FE' + relative_path

def get_public_dir(relative_path = ''):
    return get_frontend_dir('/public' + relative_path)

def get_build_dir(relative_path = ''):
    return get_frontend_dir('/build' + relative_path)

def save_uploaded_file_to_dir(upload_file, relative_dir, filename):
    try:
        # save to public and build
        save_dir = get_public_dir(relative_dir)
        file_target = save_dir + '/' + filename
        Path(save_dir).mkdir(parents=True, exist_ok=True)
        upload_file.save(file_target)

        # // copy to build dir
        build_dir = get_build_dir(relative_dir)
        Path(build_dir).mkdir(parents=True, exist_ok=True)
        print('copyfile')
        print(file_target, f'{build_dir}/{filename}')
        copyfile(file_target, f'{build_dir}/{filename}')

    except:
        pass

    return '/'.join([relative_dir, filename])