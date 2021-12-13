import json

from flask import Flask, request, jsonify
import os
import common
from controller import user_controller, link_controller, db_controller
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from flask_cors import cross_origin, CORS
from flask_mail import Mail, Message
import ipaddress
import paramiko

import smtplib
from models.datatable_factory import DatatableFactory
from models.user import User
from models.customer import Customer
from config import app

CORS(app)
LOCAL = True
# Init app
# app = Flask('RetailApp')
UPLOAD_FOLDER = './public/uploads'
ALLOWED_EXTENSIONS = set([ 'csv'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

mail_settings = {
    "MAIL_SERVER": os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
    "MAIL_PORT": os.getenv('MAIL_PORT', 465),
    "MAIL_USE_TLS": os.getenv('MAIL_USE_TLS', False),
    "MAIL_USE_SSL": os.getenv('MAIL_USE_SSL', True),
    "MAIL_USERNAME": os.getenv('MAIL_USERNAME', 'bigmlpiter@gmail.com'),
    "MAIL_PASSWORD": os.getenv('MAIL_PASSWORD', 'lwkxryjyflksuwni'),
}

app.config.update(mail_settings)
mail = Mail(app)


# Application Configuration
SENDER_EMAIL = os.getenv('SEND_EMAIL', 'code.lover1110@gmx.com')
# app.config['MAIL_SERVER'] = os.getenv('EMAIL_HOST', 'smtp.mailgun.org')
# app.config['MAIL_PORT'] = int(os.getenv('EMAIL_PORT', 587))
# app.config['MAIL_USERNAME'] = os.getenv('EMAIL_HOST_USER', 'postmaster@violetteam.com')
# app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_HOST_PASSWORD', '0f219f465ea3d17caa802d481f913aa0-156db0f1-19949148')
# app.config['MAIL_USE_TLS'] = os.getenv('EMAIL_USE_TLS', True)
# app.config['MAIL_USE_SSL'] = os.getenv('EMAIL_USE_SSL', False)

app.config['SECRET_KEY'] = 'OrderaheadSecretKey'
app.config['JWT_SECRET_KEY'] = 'SecretSecureKy'
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

# JwtManager object
jwt = JWTManager(app)
# create an instance of the Mail class
mail = Mail(app)


# Flask maps HTTP requests to Python functions.
# The process of mapping URLs to functions is called routing.
@app.route('/', methods=['GET'])
def home():
    return "<h1>API for Order ahead</h1>"


# Log In
@app.route('/users/authenticate', methods=["POST", "OPTIONS"], strict_slashes=False)
@cross_origin()
def logIn():
    # Receives the data in JSON format in a HTTP POST request
    if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

    content = request.get_json()
    email = content.get("email")
    password = content.get("password")
    # If true, do verify
    confirm = content.get("confirm")

    if not (email or password):
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Please input the email and password."}),
            status=401,
            mimetype='application/json'
        )
        return response

    result = user_controller.getUserByEmail(email)

    if result:
        if common.verify_hash(password, result['password']):
            if result['is_active']:
                # Do 2mfa
                if confirm:
                    verif_code = common.get_verification_code()
                    user_controller.updateVerificatonCOdeById(verif_code, result['id'])

                    verif_message = "Please confirm your email to log in."
                    # MFA with Email
                    if result['mfa'] == 'email':
                        msg = Message('Welcome to Order Ahead', sender=SENDER_EMAIL, recipients=email)
                        msg.body = "Verification code:\n {}".format(verif_code)
                        print(msg.body)
                        if not LOCAL:
                            mail.send(msg)
                        else:
                            # server = smtplib.SMTP("localhost", 10255)
                            # server.sendmail(SENDER_EMAIL, [email], msg.as_string())
                            # server.quit()

                            msg = Message(subject="Welcome to Order ahead",
                                          sender=SENDER_EMAIL,
                                          recipients=[email],  # replace with your email for testing
                                          body="Verification code:\n {}".format(verif_code))

                            mail.send(msg)

                    # MFA with phone
                    else:
                        verif_message = "Please confirm your phone to log in."
                        print('Sending the sms using Twilio')

                    access_token = create_access_token(identity=email)
                    response = app.response_class(
                        response=json.dumps(
                            {"status": False, "message": verif_message}),
                        status=200,
                        mimetype='application/json'
                    )
                    return response

                else:
                    access_token = create_access_token(identity=email)
                    response = app.response_class(
                        response=json.dumps(
                            {"status": True, "message": "successfully logged in", "data": "{}".format(result['id']),
                             "isAdmin": result['is_superuser'], "token": access_token}),
                        status=200,
                        mimetype='application/json'
                    )
                    return response
            else:
                response = app.response_class(
                    response=json.dumps({"status": False, "message": "Your account need to be active"}),
                    status=401,
                    mimetype='application/json'
                )
                return response
        else:
            response = app.response_class(
                response=json.dumps({"status": False, "message": "Wrong credential"}),
                status=401,
                mimetype='application/json'
            )
            return response
    else:
        response = app.response_class(
            response=json.dumps(
                {"status": False, "message": "Email or password is not correct."}),
            status=401,
            mimetype='application/json'
        )
        return response


# Register
@app.route('/users/register', methods=["POST", "OPTIONS"], strict_slashes=False)
@cross_origin()
def register():
    # Receives the data in JSON format in a HTTP POST request
    if not request.is_json:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    content = request.get_json()
    code = content.get("code")
    username = content.get("username")
    email = content.get("email")
    password = content.get("password")

    if not (username or email or password or code):
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    role_info = link_controller.getLinkByCode(code)

    if not role_info:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Invalid Access"}),
            status=404,
            mimetype='application/json'
        )
        return response

    if role_info['role'] == 'Customer':
        fullname = content.get("fullname")
        medid = content.get("medid")
        birthdate = content.get("birthdate")

        customer_id = ''
        customer = Customer.create_by_medical_id(medid)
        if customer:
            customer_id = customer.customer_id

        customer_data = {
            'username': username,
            'email': email,
            'password': common.generate_hash(password),
            'is_superuser': role_info['level'],
            'role': role_info['role'],
            'fullname': fullname,
            'med_id': medid,
            'customer_id': customer_id,
            'birth_date': birthdate,
        }

        user_controller.addCustomer(customer_data)
    else:
        user_controller.saveUserByUsernameAndEmailAndPassword(username, email, password, role_info['level'], role_info['role'])

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully registered"}),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/users/forgotPasswordToConfirmEmail', methods=["POST"], strict_slashes=False)
@cross_origin()
def forgotPasswordToConfirmEmail():
    # Receives the data in JSON format in a HTTP POST request
    if not request.is_json:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    content = request.get_json()
    email = content.get("email")

    if not email:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    result = user_controller.getUserByEmail(email)
    if result:
        verif_code = common.get_verification_code()
        user_controller.updateVerificatonCOdeById(verif_code, result['id'])

        msg = Message('Welcome to Order Ahead', sender=SENDER_EMAIL, recipients=email)
        msg.body = "If you forgot the password, please input the verification code:\n {}".format(verif_code)
        if not LOCAL:
            mail.send(msg)
        else:
            # server = smtplib.SMTP("localhost", 10255)
            # server.sendmail(SENDER_EMAIL, [email], msg.as_string())
            # server.quit()
            # server = SMTPServer()
            # server.start()
            # try:
            #     send_email(SENDER_EMAIL, email, "If you forgot the password, please input the verification code:\n {}".format(verif_code))
            # finally:
            #     server.stop()
            msg = Message(subject="Welcome to Order ahead",
                          sender=SENDER_EMAIL,
                          recipients=[email],  # replace with your email for testing
                          body="If you forgot the password, please input the verification code:\n {}".format(verif_code))

            mail.send(msg)

        response = app.response_class(
            response=json.dumps({"status": True}),
            status=200,
            mimetype='application/json'
        )
        return response
    else:
        response = app.response_class(
            response=json.dumps({"status": False}),
            status=404,
            mimetype='application/json'
        )
        return response


@app.route('/users/forgotPassword', methods=["POST"], strict_slashes=False)
@cross_origin()
def forgotPassword():
    # Receives the data in JSON format in a HTTP POST request
    if not request.is_json:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    content = request.get_json()
    code = content.get("code")
    email = content.get("email")
    password = content.get("password")

    if not (email or password or code):
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    result = user_controller.getUserByEmail(email)

    if not result or result['verif_code'] != code:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Email or Verification code is incorrect"}),
            status=404,
            mimetype='application/json'
        )
        return response

    user_controller.updatePasswordByEmail(email=email, password=password)

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully registered"}),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/users/verify', methods=["GET"], strict_slashes=False)
@cross_origin()
def verifyCode():
    query_parameters = request.args

    email = query_parameters.get('email')
    verifyCode = query_parameters.get('verifyCode')

    if not (email or verifyCode):
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    result = user_controller.getUserByEmail(email)

    if result and result['verif_code'] == verifyCode:
        response = app.response_class(
            response=json.dumps(
                {"status": True, "message": "verified"}),
            status=200,
            mimetype='application/json'
        )
        return response
    else:
        response = app.response_class(
            response=json.dumps(
                {"status": False, "message": "wrong code"}),
            status=401,
            mimetype='application/json'
        )
        return response


# Get the user info by id
@app.route('/getUser', methods=['GET'])
@cross_origin()
def getUserById():
    query_parameters = request.args

    id = query_parameters.get('id')

    if not id:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    user = User(id)
    results = user.data
    results['id'] = id

    customer = Customer.create_by_medical_id(user.med_id)
    if customer:
        customer.load_data()
        if customer:
            results['customer_id'] = customer.customer_id
            results['med_expired_date'] = customer.med_id_exp
        else:
            results['customer_id'] = ''
            results['med_expired_date'] = ''
    # results = user_controller.getUserById(id)

    return jsonify(results)


# Get all users
@app.route('/users', methods=['GET'])
@cross_origin()
def users_all():

    return jsonify(user_controller.getAllUsers())


# Get update profile(first_name, last_name, phone_number)
@app.route('/users/<int:update_id>',  methods=['PUT'])
@cross_origin()
def update_entry(update_id):

    content = request.get_json()
    allow_fields = [
        {'key': 'first_name', 'required': True},
        {'key': 'last_name', 'required': True},
        {'key': 'med_id', 'required': True},
        {'key': 'phone_number', 'required': False},
        {'key': 'address_1', 'required': False},
        {'key': 'address_2', 'required': False},
        {'key': 'city', 'required': False},
        {'key': 'zip', 'required': False},
        {'key': 'last_purchase_date', 'required': False},
    ]

    is_valid = True
    for field in allow_fields:
        value = content.get(field['key'])

        if not value and field['required']:
            is_valid = False
            break

    if not is_valid or not update_id:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response


    user = User(update_id)
    for field in allow_fields:
        value = content.get(field['key'])
        setattr(user, field['key'], value)
    user.save()

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully updated"}),
        status=200,
        mimetype='application/json'
    )
    return response


# Get update profile(first_name, last_name, phone_number, active and so on...)
@app.route('/admin/users/<int:update_id>',  methods=['PUT'])
@cross_origin()
def update_for_admin(update_id):

    content = request.get_json()
    first_name = content.get("first_name")
    last_name = content.get("last_name")
    phone_number = content.get("phone_number")
    is_active = content.get("is_active")
    update_id = int(update_id)

    if not (update_id or first_name or last_name or phone_number or is_active):
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    user_controller.updateNameAndPhoneAndActiveById(first_name, last_name, phone_number, is_active, update_id)

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully updated"}),
        status=200,
        mimetype='application/json'
    )
    return response


# Get update profile(MFA)
@app.route('/updateMfa/<int:update_id>',  methods=['PUT'])
@cross_origin()
def update_mfa(update_id):

    content = request.get_json()
    mfa = content.get("mfa")
    update_id = int(update_id)

    if not (update_id or mfa):
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    user_controller.updateMFAById(mfa, update_id)

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully updated"}),
        status=200,
        mimetype='application/json'
    )
    return response


# Update new password
@app.route('/users/updatePassword/<int:update_id>',  methods=['PUT'])
@cross_origin()
def update_new_password(update_id):

    content = request.get_json()
    oldPassword = content.get("oldPassword")
    password = content.get("password")

    update_id = int(update_id)

    if not (update_id or oldPassword or password):
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    result = user_controller.getUserById(update_id)

    if not result:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Not found the user"}),
            status=404,
            mimetype='application/json'
        )
        return response

    if common.verify_hash(oldPassword, result['password']):
        user_controller.updatePasswordByEmail(email=result['email'], password=password)
        response = app.response_class(
            response=json.dumps({"status": True, "message": "successfully new password was updated"}),
            status=200,
            mimetype='application/json'
        )
        return response
    else:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Password is incorrect."}),
            status=404,
            mimetype='application/json'
        )
        return response


# Delete the account
@app.route('/users/<int:delete_id>',  methods=['DELETE'])
@cross_origin()
def delete_account(delete_id):

    delete_id = int(delete_id)

    if not (delete_id):
        return jsonify({"status": False, "message": "Input error!"})

    user_controller.deleteAccount(delete_id)

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully deleted"}),
        status=200,
        mimetype='application/json'
    )
    return response


# Create Link
@app.route('/link/create', methods=["POST"], strict_slashes=False)
@cross_origin()
def createLink():
    # Receives the data in JSON format in a HTTP POST request
    if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

    content = request.get_json()
    level = content.get("level")
    label = content.get("label")

    if not (level, label):
        return jsonify({"status": False, "message": "Input error!"})

    link_controller.saveLinkByLevelAndLabel(level, label)

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully created"}),
        status=200,
        mimetype='application/json'
    )
    return response


# Get all users
@app.route('/links', methods=['GET'])
@cross_origin()
def links_all():

    return jsonify(link_controller.getAllLinks())


# Create Link
@app.route('/links/send', methods=["POST"], strict_slashes=False)
@cross_origin()
def sendLink():
    # Receives the data in JSON format in a HTTP POST request
    if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

    content = request.get_json()

    code = content.get("code")
    label = content.get("label")
    level = content.get("level")
    sendEmail = content.get("sendEmail")

    if not (level, label, code, sendEmail):
        return jsonify({"status": False, "message": "Input error!"})

    msg = Message('Welcome to Order Ahead', sender=SENDER_EMAIL, recipients=sendEmail)
    msg.body = "Please input the following URL to sign up:\n " + code
    if not LOCAL:
        mail.send(msg)
    else:
        # server = smtplib.SMTP("localhost", 10255)
        # server.sendmail(SENDER_EMAIL, [sendEmail], msg.as_string())
        # server.quit()
        msg = Message(subject="Welcome to Order ahead",
                      sender=SENDER_EMAIL,
                      recipients=[sendEmail],  # replace with your email for testing
                      body="Please input the following URL to sign up:\n " + code)

        mail.send(msg)

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully sent"}),
        status=200,
        mimetype='application/json'
    )
    return response


# Get the user info by id
@app.route('/confirmCodeBeforeSignup', methods=['GET'])
@cross_origin()
def confirmCodeBeforeSignup():
    query_parameters = request.args

    code = query_parameters.get('code')

    if not code:
        return jsonify({"status": False, "message": "Input error!"})

    result = link_controller.getLinkByCode(code)

    if result:
        return jsonify(result)
    else:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Not found"}),
            status=404,
            mimetype='application/json'
        )
        return response

@app.route('/lastPurchases/<int:user_id>', methods=['GET', 'POST'])
@cross_origin()
def getLastPurchasesByDate(user_id):
    purchases = user_controller.get_last_purchases_by_date(user_id)
    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully sent", "data": purchases}),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/loadDatatable/<data_type>', methods=['GET'])
@cross_origin()
def loadDatatable(data_type):
    factory = DatatableFactory()
    instance = factory.create(data_type)

    data = []
    if instance:
        data = instance.load_data()

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully sent", "data": data}),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/getTableList', methods=['GET'])
@cross_origin()
def getTableList():

    result = db_controller.get_table_list()

    if not result or len(result) == 0:
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Database doesn\'t exist."}),
            status=404,
            mimetype='application/json'
        )
        return response

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully sent", "data": result}),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/getDataInfoByTableName', methods=["POST"], strict_slashes=False)
@cross_origin()
def getDataInfoByTableName():
    # Receives the data in JSON format in a HTTP POST request
    if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

    content = request.get_json()
    table_name = content.get("name")

    if not (table_name):
        return jsonify({"status": False, "message": "Input error!"})

    result = db_controller.get_all_data_by_name(table_name)

    columns = db_controller.get_column_names_per_table(table_name)

    return jsonify({"status": True, "data": result[::-1], "columns": columns})


@app.route('/uploadFile', methods=["POST"], strict_slashes=False)
@cross_origin()
def uploadCSVFile():
    # Receives the data in JSON format in a HTTP POST request
    if request.method == 'POST':
        file = request.files['csv']
        if file.filename == '':
            return jsonify({"status": False, "message": "No selected file"})

        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        file.close()

        table_name = db_controller.get_table_name_from_csv(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))

        if table_name == '':
            return jsonify({"status": False, "message": "Responding table no exist."})

        try:
            db_controller.write_multiple_line(os.path.join(app.config['UPLOAD_FOLDER'], file.filename), table_name)
        except Exception as e:
            print(e)
            return jsonify({"status": False, "message": "Unfortunatelly failed. Please confirm the CSV file."})

        return jsonify({"status": True, "message": "Successfully inserted \"" + table_name + "\"", "table": table_name})
    else:
        return jsonify({"status": False, "message": "Request error"})


@app.route('/downloadCSV', methods=["POST"], strict_slashes=False)
@cross_origin()
def downloadCSV():
    # Receives the data in JSON format in a HTTP POST request
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"status": False, "message": "Input error!"})

        content = request.get_json()
        table_name = content.get("name")

        if not (table_name):
            return jsonify({"status": False, "message": "Input error!"})

        result = db_controller.get_all_data_by_name(table_name)

        columns = db_controller.get_column_names_per_table(table_name)

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], "output.csv")

        column_str = ','.join(columns)

        with open(file_path, 'w', encoding="utf8") as f:
            f.writelines(column_str)
            f.write('\n')

            for row in result:
                line_str = ''
                for id_c in row:
                    if str(id_c).find(",") > -1:
                        line_str += "\"" + str(id_c) + "\"" + ','
                    else:
                        line_str += str(id_c) + ','
                f.writelines(line_str[:-1])
                f.write('\n')

        with open(file_path, encoding="utf8") as f:
            data = f.read()

        return {"data": data}


@app.route('/admin/updateTable',  methods=['PUT'])
@cross_origin()
def update_table():

    content = request.get_json()
    table_name = content.get("table_name")
    column = content.get("column")
    data = content.get("data")

    if not (table_name or column or data):
        response = app.response_class(
            response=json.dumps({"status": False, "message": "Input error!"}),
            status=404,
            mimetype='application/json'
        )
        return response

    try:
        db_controller.update_table(table_name=table_name, column=column, data=data)
    except Exception as e:
        print(e)
        response = app.response_class(
            response=json.dumps({"status": False, "message": str(e)}),
            status=500,
            mimetype='application/json'
        )
        return response

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully updated"}),
        status=200,
        mimetype='application/json'
    )
    return response


# Create Link
@app.route('/createIP', methods=["POST"], strict_slashes=False)
@cross_origin()
def createIP():
    # Receives the data in JSON format in a HTTP POST request

    if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

    content = request.get_json()
    ip = content.get("ip_address")

    if not (ip):
        return jsonify({"status": False, "message": "Input error!"})

    try:
        ipaddress.ip_address(ip)
    except ValueError as e:
        print(e)
        return jsonify({"status": False, "message": "IP address is incorrect."})

    db_controller.create_ip(ip)
    add_ip(ip)

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully created"}),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/deleteIPAddress', methods=["POST"], strict_slashes=False)
@cross_origin()
def deleteIPAddress():
    # Receives the data in JSON format in a HTTP POST request
    if not request.is_json:
        return jsonify({"status": False, "message": "Input error!"})

    content = request.get_json()
    ip_addrss = content.get("data")

    if not (ip_addrss):
        return jsonify({"status": False, "message": "Input error!"})

    db_controller.delete_ip(ip_addrss)
    remove_ip(ip_addrss)

    response = app.response_class(
        response=json.dumps({"status": True, "message": "successfully deleted."}),
        status=200,
        mimetype='application/json'
    )
    return response


def add_ip(ip):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname='52.191.3.0', username='azureuser',key_filename="/home/azureuser/.ssh/id_rsa", password="alextwo")
    cmd = ' sudo sed  -i   "s/host *all *all *127.0.0.1\/32 *scram-sha-256/& \\nhost all postgres %s\/32 trust/" /etc/postgresql/14/main/pg_hba.conf' %ip
    cmd.replace("\\n", "\n")
    #print(cmd2)
    print(ip)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.readlines())
    cmd2 = 'sudo service postgresql restart'
    stdin, stdout, stderr = ssh.exec_command(cmd2)
    print(stdout.readlines())


def remove_ip(ip):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname='52.191.3.0', username='azureuser',key_filename="/home/azureuser/.ssh/id_rsa", password="alextwo")
    cmd = ' sudo sed  -i   "/%s/g" /etc/postgresql/14/main/pg_hba.conf' %ip
    cmd.replace("\\n", "\n")
    #print(cmd2)
    print(ip)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.readlines())
    cmd2 = 'sudo service postgresql restart'
    stdin, stdout, stderr = ssh.exec_command(cmd2)
    print(stdout.readlines())


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found</p>", 404


#Provide routes for api flowhub
import flowhub.api
import models.ordersystem
import test


# A method that runs the application server.
if __name__ == "__main__":
    # Threaded option to enable multiple instances for multiple user access support
    app.run(debug=True, threaded=True, port=os.getenv('PORT'))
