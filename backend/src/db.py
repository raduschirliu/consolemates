import os
import psycopg2
import random

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
            sentiment varchar(255) NOT NULL,
            content varchar(max) NOT NULL
        );
    """

    try:
        cursor.execute(sql)
        conn.commit()
        conn.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def create_user_topic_table():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    sql = """
        CREATE TABLE IF NOT EXISTS user_topic (
            user_id varchar(255) NOT NULL,
            topic_id varchar(255) NOT NULL,
            PRIMARY KEY(user_id, topic_id)
        );
    """

    try:
        cursor.execute(sql)
        conn.commit()
        conn.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def create_letter_topic_table():

    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    sql = """
        CREATE TABLE IF NOT EXISTS letter_topic (
           letter_id varchar(255) NOT NULL,
           topic_id varchar(255) NOT NULL,
           PRIMARY KEY (letter_id, topic_id)
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
def get_recipient(topic_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    # returns user id that has this topic_id in their preferred topics
    sql = "SELECT * FROM UserTopic WHERE topic_id = %s"
    cursor.execute(sql, (topic_id,))
    user_ids = cursor.fetchall()
    if user_ids.isEmpty():
        return None
    return user_ids[0]

def get_random_recipient():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    # returns user id that has this topic_id in their preferred topics
    sql = "SELECT id FROM Users"
    cursor.execute(sql)
    user_ids = cursor.fetchall()
    return random.choice(user_ids)


