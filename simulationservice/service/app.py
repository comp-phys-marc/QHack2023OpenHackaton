import json
import signal
import os
from flask import Flask, request, abort
from flask_cors import CORS
from auth import AuthGuard, REFRESH_TOKEN_KEY, TOKEN_KEY, ExpiredSignatureError
from gevent import monkey
from gevent.pywsgi import WSGIServer
from settings import Settings

import strawberryfields as sf

monkey.patch_all()

# Application specific
app = Flask(__name__)
CORS(app)
settings = Settings()

# Supporting backends
supported_backends = ["fock", "gaussian"]


@app.route("/simulate", methods=["POST"])
def simulate():
    data = request.json
    response = {"result": None, "error": None, "status": None}
    if "code" not in data:
        response["status"] = 400
        response["error"] = "No code given to execute"
        return json.dumps(response)
    # try:
    #     user_id = AuthGuard.authenticate(data)
    # except Exception as ex:
    #     abort(401)

    # should be a LIST OF LINES
    # {
    #  "code" : ["a", "b", "c"]
    # }
    sent_code = data["code"]

    response["status"] = 200

    # save the received string to a temp file
    with open("temp.xbb", "w") as fp:
        for line in sent_code:
            fp.write(line + "\n")
    try:
        blackbird_repr = sf.load("temp.xbb")
        # try the code execution on a provided simulator backend
        if blackbird_repr.target not in supported_backends:
            if blackbird_repr.target:
                error_msg = "Given backend is not supported"
            else:
                error_msg = "No backend is specified"
            response["error"] = error_msg

        else:
            engine = sf.Engine(
                backend=blackbird_repr.target,
                backend_options=blackbird_repr.backend_options,
            )
            results = engine.run(blackbird_repr)
            print("Success!\n Results : ", results)
            print(results.samples)

            # this will be list of lists
            response_measurement = []
            for sample in results.samples:
                curr_list = []
                for value in sample:
                    if isinstance(value, (int, float)):
                        str_val = str(value)
                    else:
                        str_val = f"{value.real}+j{value.imag}"
                    curr_list.append(str_val)
                response_measurement.append(curr_list)

            response["result"] = {"measurements": response_measurement}
    except Exception as err:
        response[
            "error"
        ] = f" The following exception occurred during the execution of your program - \n{err}"

    os.remove("temp.xbb")
    return json.dumps(response)


# @app.route('/auth', methods=['POST', 'PUT'])
# def auth():
#     print(request.data, sys.stderr)

#     data = json.loads(request.data.decode("utf-8"))

#     if request.method == 'POST':
#         response, status = new_auth_response(data)
#         return response, status

#     elif request.method == 'PUT':

#         old_auth_token = data[TOKEN_KEY]

#         try:

#             if REFRESH_TOKEN_KEY in data:
#                 refresh_token = data[REFRESH_TOKEN_KEY]
#             else:
#                 raise Exception

#             decoded_auth_token = AuthGuard.decode_token(old_auth_token)

#             try:
#                 AuthGuard.check_token_expired(old_auth_token)

#             except ExpiredSignatureError:

#                 decoded_refresh_token = AuthGuard.decode_token(refresh_token)

#                 if not decoded_refresh_token[TOKEN_KEY] == old_auth_token \
#                         or AuthGuard.check_token_expired(refresh_token):
#                     raise Exception

#             user_id = str(decoded_auth_token['id'])
#             user = # TODO: get DEFAULT_USER

#             if user is not None:
#                 return json.dumps(AuthGuard.auth_response(user['data'])), 200
#             else:
#                 abort(403)

#         except Exception as ex:
#             print(str(ex))
#             abort(401)


# def new_auth_response(user_data):
#     username = user_data['name']
#     password = user_data['password']
#     # response = TODO: login(username, password)

#     if 'data' in response.keys():
#         user = response['data']
#         return json.dumps(AuthGuard.auth_response(user)), response['status']
#     else:
#         return json.dumps(response), response['status']


def _signal_handler(param1, param2):
    exit()


if __name__ == "__main__":
    signal.signal(signal.SIGINT, _signal_handler)
    http_server = WSGIServer(("0.0.0.0", 5000), app.wsgi_app)
    http_server.serve_forever()
