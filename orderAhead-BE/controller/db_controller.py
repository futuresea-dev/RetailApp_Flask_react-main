import csv
from .postgre_model import Postgres_DB
import datetime

PROPERTIES_OF_TABLE = [
    {
        "table_name": "Inventory",
        "column_1": "Brand",
        "column_2": "Batch ID"
    },
    {
        "table_name": "Sales",
        "column_1": "Employee Name",
        "column_2": "Current Loyalty Points"
    },
    {
        "table_name": "Sales_by_item",
        "column_1": "Receipt Total",
        "column_2": "Tax in Dollars"
    },
    {
        "table_name": "ftp_files",
        "column_1": "filename",
        "column_2": "insert_datetime"
    },
    {
        "table_name": "Drawer_activities",
        "column_1": "Beginning Balance",
        "column_2": "Drawer Total"
    },
    {
        "table_name": "manager CDD",
        "column_1": "Closed Drawer Difference",
        "column_2": "Drawer Name"
    },
    {
        "table_name": "Card Expiration Report",
        "column_1": "Customer Source",
        "column_2": "Med ID Exp"
    },
    {
        "table_name": "Customers",
        "column_1": "Customer ID",
        "column_2": "Loyalty Member"
    },
    {
        "table_name": "Discounts",
        "column_1": "Discount Applied by",
        "column_2": "Receipt ID"
    },
    {
        "table_name": "Flower Tier Report",
        "column_1": "Price Profile Name",
        "column_2": "Strain Name"
    }
]


def get_table_list():
    table_list = Postgres_DB.get_table_list()
    return table_list


def get_all_data_by_name(table_name):
    sql = f'SELECT * FROM "{table_name}";'
    return Postgres_DB.fetchall(sql)


def get_column_names_per_table(table_name):
    sql = f'SELECT * FROM "{table_name}" LIMIT 0;'
    return Postgres_DB.fetch_column_name(sql)


def get_table_name_from_csv(csv_file):
    with open(csv_file, 'r', encoding="utf8") as f:
        d_reader = csv.DictReader(f)

        # get fieldnames from DictReader object and store in list
        headers = d_reader.fieldnames

        if headers and len(headers) > 0:

            for table_name in PROPERTIES_OF_TABLE:
                check_1 = False
                check_2 = False
                for header in headers:
                    if table_name["column_1"] == header:
                        check_1 = True
                    if table_name["column_2"] == header:
                        check_2 = True

                if check_1 and check_2:
                    return table_name["table_name"]

        return ''


def write_multiple_line(csv_file, table_name):
    with open(csv_file, 'r', encoding="utf8") as f:

        # Get the Header
        d_reader = csv.DictReader(f)
        headers = d_reader.fieldnames

        # creating an object of csv reader
        # with the delimiter as
        csv_reader = csv.reader(f)

        last_length = len(headers) - 1
        if headers[len(headers) - 1] == "insert_datetime":
            last_length = len(headers) - 2

        is_insert_datetime = False
        sql = f'INSERT INTO "{table_name}" ('
        for inH_, header in enumerate(headers):
            if table_name == "Inventory" and header == "insert_datetime":
                is_insert_datetime = True
            if inH_ > last_length:
                continue
            elif inH_ == last_length:
                if table_name == "Inventory" and is_insert_datetime:
                    sql += f'"{header}") VALUES '
                else:
                    sql += f'"{header}", "insert_datetime") VALUES '
            else:
                sql += f'"{header}", '

        # loop to iterate through the rows of csv
        for row in csv_reader:

            break_condition = True
            for id_, c in enumerate(row):
                if c != "":
                    break_condition = False
                    break
                if id_ >= len(row) - 1 and c == "":
                    break_condition = True
            if break_condition:
                break
            # adding the first row
            today_str = str(datetime.datetime.now())

            sql += f'('
            for idc_, column in enumerate(row):
                content = str(column).replace('\'', '\\''')
                if content.isdigit():
                    content = int(content)

                if idc_ > last_length:
                    continue
                elif idc_ == last_length:
                    if content != "" and content != "None":
                        if table_name == "Inventory" and is_insert_datetime:
                            sql += f'\'{content}\' '
                        else:
                            sql += f'\'{content}\', \'{today_str}\' '
                    else:
                        if table_name == "Inventory" and is_insert_datetime:
                            sql += f'DEFAULT '
                        else:
                            sql += f'DEFAULT, \'{today_str}\' '
                else:
                    if content != "" and content != "None":
                        sql += f'\'{content}\', '
                    else:
                        sql += f'DEFAULT, '

            sql += f'),'

        Postgres_DB.copy_csv(sql[:-1] + f';')

        return headers


def update_table(table_name, column, data):

    sql1 = f'UPDATE "{table_name}" SET '

    sql2 = f''

    sql3 = f' WHERE '

    for in_, content in enumerate(data):
        if str(content) == 'None' or str(content) == '':
            continue

        if str(content).find("/", 1) == 2 or str(column[in_]) == 'insert_datetime':
            if str(column[in_]) != 'insert_datetime':
                sql3 += f'\"{column[in_]}\" = \'{content}\' and '
        else:
            sql2 += f'\"{column[in_]}\" = \'{content}\','

    sql = sql1 + sql2[:-1] + sql3[:-5] + f';'

    Postgres_DB.copy_csv(sql)


def create_ip(ip_address):

    sql = f'INSERT INTO "IP manage" ("ip_address") VALUES (\'{ip_address}\');'

    Postgres_DB.copy_csv(sql)


def delete_ip(ip_address):

    sql = f'DELETE FROM "IP manage" WHERE "ip_address"=\'{ip_address}\';'

    Postgres_DB.copy_csv(sql)

