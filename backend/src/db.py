import os
import psycopg2

## global variable of database url
DATABASE_URL = os.getenv("DATABASE_URL")

## functions for creating database tables
def create_user_table():

    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    sql = """
        CREATE TABLE IF NOT EXISTS users (
            id varchar(255) NOT NULL PRIMARY KEY
        );
    """

    try:
        cursor.execute(sql)
        conn.commit()
        conn.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)



def create_topic_table():
    
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    sql = """
        CREATE TABLE IF NOT EXISTS topic (
            id varchar(255) NOT NULL PRIMARY KEY,
            name character varying(250) NOT NULL
        );
    """

    try:
        cursor.execute(sql)
        conn.commit()
        conn.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def create_letter_table():
    
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    sql = """
        CREATE TABLE IF NOT EXISTS letter (
            id varchar(255) NOT NULL PRIMARY KEY,
            author_id varchar(255) NOT NULL,
            recipient_id varchar(255) NOT NULL,
            reply_id varchar(255) NOT NULL,
            viewed BOOLEAN NOT NULL,
            sentiment varchar(255) NOT NULL
        );
    """

    try:
        cursor.execute(sql)
        conn.commit()
        conn.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

## API for letter

## API for topic

## API for user




