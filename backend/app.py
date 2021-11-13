import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

# Load environment variables
load_dotenv()

from src import util
util.example()

# Setup Flask and variables
port = int(os.getenv('PORT', 8000))
app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

# Routes
@app.route('/')
@cross_origin()
def hello_world():
    return 'hello, world'

# Main
if __name__ == '__main__':
    app.run(port=port, threaded=True)