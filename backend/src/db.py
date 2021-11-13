import os
import psycopg2
import random
import uuid

## global variable of database url
DATABASE_URL = os.getenv("DATABASE_URL")

## single database table creation function
def create_tables():
    create_letter_table()
    create_user_table()
    create_topic_table()
    create_letter_topic_table()
    create_user_topic_table()

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
            content varchar(10485760) NOT NULL
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
def get_fresh_letters():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    # returns the letter with a id matching letter_id
    sql = "SELECT * FROM letter WHERE id = %s"

    try:
        cursor.execute(sql, (letter_id,))
        letters = cursor.fetchall()
        conn.commit()
        conn.close()

        if letters.isEmpty():
            return None
        return letters
    
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return None


def get_letter(letter_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    # returns the letter with a id matching letter_id
    sql = "SELECT * FROM letter WHERE id = %s"

    try:
        cursor.execute(sql, (letter_id,))
        letter = cursor.fetchone()
        conn.commit()
        conn.close()
        if letter.isEmpty():
            return None
        return letter
        
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return None

def post_letter(author_id, recipient_id, reply_id, viewed, sentiment, content):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    id = str(uuid.uuid4())
    sql = """
    INSERT INTO letter (
        id,
        author_id,
        recipient_id,
        reply_id,
        viewed,
        sentiment,
        content
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    try:
        cursor.execute(sql, (id, recipient_id, reply_id, sentiment, content))
        
        # commit the changes
        conn.commit()
        conn.close()
        return id
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return "Failed to post letter."

## API for topic

# posts a user topic into the user_topic table
def post_user_topic(user_id, topic_id):
    
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # returns topic id that has this user_id in their preferred topics
    sql = "INSERT INTO user_topic (user_id, topic_id) VALUES (%s, %s)"
    cursor.execute(sql, (user_id, topic_id))
    conn.commit()
    conn.close()
    return

# returns an array of topics for a user
def get_user_topics(user_id):

    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # returns topic id that has this user_id in their preferred topics
    sql = "SELECT * FROM user_topic WHERE user_id = %s"
    cursor.execute(sql, (user_id,))
    topic = cursor.fetchall()
    conn.close()
    if topic.isEmpty():
        return None
    return topic

# returns an array of topics containing topic_id and name
def get_topics():

    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # returns topic id that has this user_id in their preferred topics
    sql = "SELECT * FROM topic"
    cursor.execute(sql)
    topic = cursor.fetchall()
    conn.close()
    if topic.isEmpty():
        return None
    return topic


## API for user
def get_recipient(topic_id, user_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    # returns user id that has this topic_id in their preferred topics
    sql = "SELECT * FROM user_topic WHERE topic_id = %s AND user_id <> %s"

    try:
        cursor.execute(sql, (topic_id, user_id))
        user_ids = cursor.fetchall()
        conn.commit()
        conn.close()
        if user_ids.isEmpty():
            return None
        return random.choice(user_ids)
    
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return None

def get_random_recipient(user_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    # returns user id that has this topic_id in their preferred topics
    sql = "SELECT id FROM Users WHERE id <> %s"

    try:
        cursor.execute(sql, (user_id,))
        user_ids = cursor.fetchall()
        conn.commit()
        conn.close()
        return random.choice(user_ids)

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return None
