import sqlite3
import os
import common
from models.customer import Customer

db_name = os.getenv('DB_NAME', 'order.db')


def getUserByEmail(email):
    query = 'SELECT id, email, password, username, first_name, last_name, is_superuser, is_active, mfa, verif_code, role FROM users WHERE'
    to_filter = []

    if email:
        query += ' email=? AND'
        to_filter.append(email)

    query = query[:-4] + ';'

    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    conn.row_factory = common.dict_factory
    cur = conn.cursor()

    return cur.execute(query, to_filter).fetchone()


def saveUserByUsernameAndEmailAndPassword(userName, email, password, level, role):
    # Save the data in db
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    query = f'INSERT INTO users (username, email, password, is_superuser, role) \
                  VALUES ("{userName}", "{email}", "{common.generate_hash(password)}", "{level}", "{role}");'

    cur = conn.cursor()
    cur.execute(query)
    conn.commit()


def addCustomer(customer_data):
    print('++addCustomer+++++')
    # Save the data in db
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)

    column_names = ','.join(customer_data.keys())
    column_values = (', '.join('"' + str(item) + '"' for item in customer_data.values()))

    query = f'INSERT INTO users ({column_names}) \
                  VALUES ({column_values});'

    cur = conn.cursor()
    cur.execute(query)
    conn.commit()


def getUserById(id):
    query = 'SELECT id, first_name, password, last_name, is_active, is_superuser, role, email, phone_number, username, mfa, fullname, med_id, birth_date FROM users WHERE'
    to_filter = []

    if id:
        query += ' id=? AND'
        to_filter.append(id)

    query = query[:-4] + ';'

    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    conn.row_factory = common.dict_factory
    cur = conn.cursor()

    return cur.execute(query, to_filter).fetchone()


def getAllUsers():
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    conn.row_factory = common.dict_factory
    cur = conn.cursor()
    return cur.execute(
        'SELECT first_name, last_name, username, email, is_active, is_superuser, id, role FROM users;').fetchall()


def updateNameAndPhoneById(first_name, last_name, phone_number, id):
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("update users set first_name=?, last_name=?, phone_number=? where id=?",
                (first_name, last_name, phone_number, id,))
    conn.commit()


def updatePasswordByEmail(email, password):
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("update users set password=? where email=?",
                (common.generate_hash(password), email))
    conn.commit()


# Update for Admin
def updateNameAndPhoneAndActiveById(first_name, last_name, phone_number, active, id):
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("update users set first_name=?, last_name=?, phone_number=?, is_active=? where id=?",
                (first_name, last_name, phone_number, active, id,))
    conn.commit()


def updateVerificatonCOdeById(verif_code, id):
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("update users set verif_code=? where id=?",
                (verif_code, id,))
    conn.commit()


def updateMFAById(mfa, id):
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("update users set mfa=? where id=?", (mfa, id,))
    conn.commit()


def deleteAccount(user_id):
    db_path = os.path.join('db', db_name)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("delete from users where id=?", (user_id,))
    conn.commit()


def get_last_purchases_by_date(user_id):
    print('+++++get_last_purchases_by_date++++++++++', user_id)
    result = getUserById(user_id)
    if result['role'] != 'Customer' or result['med_id'] == None:
        print('This user is not a customer or Medical ID is not exist.', result['med_id'])
        return []

    customer = Customer.create_by_medical_id(result['med_id'])
    return customer.get_last_purchases_by_date()