import json
import signal
import sys
from flask import Flask, request, abort
from flask_cors import CORS
from kombu import Queue
from auth import AuthGuard, REFRESH_TOKEN_KEY, TOKEN_KEY, ExpiredSignatureError
from gevent import monkey
from gevent.pywsgi import WSGIServer
from settings import Settings

import strawberryfields as sf

monkey.patch_all()

app = Flask(__name__)
CORS(app)

settings = Settings()

@app.route('/auth', methods=['POST', 'PUT'])
def auth():
    print(request.data, sys.stderr)

    data = json.loads(request.data.decode("utf-8"))

    if request.method == 'POST':

        response, status = new_auth_response(data)
        return response, status

    elif request.method == 'PUT':

        old_auth_token = data[TOKEN_KEY]

        try:

            if REFRESH_TOKEN_KEY in data:
                refresh_token = data[REFRESH_TOKEN_KEY]
            else:
                raise Exception

            decoded_auth_token = AuthGuard.decode_token(old_auth_token)

            try:
                AuthGuard.check_token_expired(old_auth_token)

            except ExpiredSignatureError:

                decoded_refresh_token = AuthGuard.decode_token(refresh_token)

                if not decoded_refresh_token[TOKEN_KEY] == old_auth_token \
                        or AuthGuard.check_token_expired(refresh_token):
                    raise Exception

            user_id = str(decoded_auth_token['id'])
            user = # TODO: get DEFAULT_USER

            if user is not None:
                return json.dumps(AuthGuard.auth_response(user['data'])), 200
            else:
                abort(403)

        except Exception as ex:
            print(str(ex))
            abort(401)


@app.route('/simulate', methods=['POST'])
def simulate():

    data = json.loads(request.data.decode("utf-8"))
    user_id = None

    if 'code' not in data or 'name' not in data:
        abort(400)

    try:
        user_id = AuthGuard.authenticate(data)

    except Exception as ex:
        abort(401)

    # response = TODO: use StrawberryFields here

    if response is not None:
        return json.dumps(response), response['status']
    else:
        abort(403)


def new_auth_response(user_data):
    username = user_data['name']
    password = user_data['password']
    # response = TODO: login(username, password)

    if 'data' in response.keys():
        user = response['data']
        return json.dumps(AuthGuard.auth_response(user)), response['status']
    else:
        return json.dumps(response), response['status']


def _signal_handler(param1, param2):
    exit()


if __name__ == '__main__':
    signal.signal(signal.SIGINT, _signal_handler)
    http_server = WSGIServer(('0.0.0.0', 5000), app.wsgi_app)
    http_server.serve_forever()
