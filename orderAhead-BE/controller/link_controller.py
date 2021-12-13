import sqlite3
import os
import common

db_name = os.getenv('DB_NAME', 'order.db')


def saveLinkByLevelAndLabel(level, label):
    # Save the data in db
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    query = f'INSERT INTO links (code, level, role) \
                  VALUES ("{common.get_verification_code()}", "{level}", "{label}");'

    cur = conn.cursor()
    cur.execute(query)
    conn.commit()


def getAllLinks():
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    conn.row_factory = common.dict_factory
    cur = conn.cursor()
    return cur.execute(
        'SELECT * FROM links;').fetchall()


def getLinkByCode(code):
    query = 'SELECT * FROM links WHERE'
    to_filter = []

    if code:
        query += ' code=? AND'
        to_filter.append(code)

    query = query[:-4] + ';'

    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    conn.row_factory = common.dict_factory
    cur = conn.cursor()

    return cur.execute(query, to_filter).fetchone()
