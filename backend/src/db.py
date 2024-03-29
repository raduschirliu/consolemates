import os
import psycopg2
import random
import uuid
from psycopg2.extras import RealDictCursor

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
    cursor = conn.cursor(cursor_factory=RealDictCursor)

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
    cursor = conn.cursor(cursor_factory=RealDictCursor)

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
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    sql = """
        CREATE TABLE IF NOT EXISTS letter (
            id varchar(255) NOT NULL PRIMARY KEY,
            author_id varchar(255) NOT NULL,
            subject varchar(255) NOT NULL,
            recipient_id varchar(255) NOT NULL,
            reply_id varchar(255),
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
    cursor = conn.cursor(cursor_factory=RealDictCursor)

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
    cursor = conn.cursor(cursor_factory=RealDictCursor)

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
def get_fresh_letters(user_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    # returns all letters for which the recipient_id matches the user_id and viewed is false
    sql = "SELECT * FROM letter WHERE recipient_id = %s AND viewed = %s"

    try:
        cursor.execute(sql, (user_id, False))
        letters = cursor.fetchall()
        conn.commit()
        conn.close()

        if not letters:
            return None
        return letters
    
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return None


def get_letter(letter_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    # returns the letter with a id matching letter_id
    sql = "SELECT * FROM letter WHERE id = %s"

    try:
        cursor.execute(sql, (letter_id,))
        letter = cursor.fetchone()
        conn.commit()
        conn.close()
        if not letter:
            return None
        return letter
        
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return None

def post_letter(author_id, subject, recipient_id, reply_id, viewed, sentiment, content):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    id = str(uuid.uuid4())
    sql = """
    INSERT INTO letter (
        id,
        author_id,
        subject,
        recipient_id,
        reply_id,
        viewed,
        sentiment,
        content
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    try:
        cursor.execute(sql, (id, author_id, subject, recipient_id, reply_id, viewed, sentiment, content))
        
        # commit the changes
        conn.commit()
        conn.close()
        return id
    except (Exception, psycopg2.DatabaseError) as error:
        print("post_letter")
        print(error)
        return "Failed to post letter."


def put_letter_viewed(letter_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    # sets the viewed column to true for the letter with a matching letter_id
    sql = "UPDATE letter SET viewed = true WHERE id = %s"

    try:
        cursor.execute(sql, (letter_id,))
        # commit the changes
        conn.commit()
        conn.close()
        return letter_id
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return letter_id

## API for topic

# delete all topics for a user
def clear_topics(user_id): 
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # returns topic id that has this user_id in their preferred topics
    sql = "DELETE FROM user_topic WHERE user_id = %s"
    cursor.execute(sql, (user_id,))
    conn.commit()
    conn.close()
    return user_id


# posts a user topic into the user_topic table
def post_user_topic(user_id, topic_id):
    
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # returns topic id that has this user_id in their preferred topics
    sql = "INSERT INTO user_topic (user_id, topic_id) VALUES (%s, %s)"
    cursor.execute(sql, (user_id, topic_id))
    conn.commit()
    conn.close()
    return topic_id


# returns an array of topics for a user
def get_user_topics(user_id):

    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # returns topic id that has this user_id in their preferred topics
    sql = "SELECT t.name, t.id FROM user_topic ut, topic t WHERE t.id = ut.topic_id AND ut.user_id = %s "
    cursor.execute(sql, (user_id,))
    topic = cursor.fetchall()
    conn.close()
    if not topic:
        return []
    return topic


# returns an array of topics containing topic_id and name
def get_topics():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # returns topic id that has this user_id in their preferred topics
    sql = "SELECT * FROM topic"
    cursor.execute(sql)
    topic = cursor.fetchall()
    conn.close()
    if not topic:
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
        user_ids = [r[0] for r in cursor.fetchall()]
        conn.commit()
        conn.close()
        if not user_ids:
            return None
        print(user_ids)
        return random.choice(user_ids)
    
    except (Exception, psycopg2.DatabaseError) as error:
        print("get_recipient")
        print(error)
        return None


def get_random_recipient(user_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()
    # returns user id that has this topic_id in their preferred topics
    sql = "SELECT id FROM Users WHERE id <> %s"

    try:
        cursor.execute(sql, (user_id,))
        user_ids = [r[0] for r in cursor.fetchall()]
        conn.commit()
        conn.close()
        if not user_ids:
            return None
        print(user_ids)
        return random.choice(user_ids)

    except (Exception, psycopg2.DatabaseError) as error:
        print("get_random_recipient")
        print(error)
        return None

## API for stats
def get_stats(user_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # returns topic id that has this user_id in their preferred topics
    sql = "SELECT sentiment FROM letter WHERE author_id = %s "
    cursor.execute(sql, (user_id,))
    sentiments = [r[0] for r in cursor.fetchall()]
    print(sentiments)
    conn.close()
    if not sentiments:
        return {}
    return {i:sentiments.count(i) for i in set(sentiments)}
