import jwt
from datetime import datetime, timedelta

SECRET = 'LEISDElezvz$2a$04$TiS2kzpqRd.xqJdIJ9vXlTv8sbxuarlrc/if475z'
TOKEN_KEY = 'token'
REFRESH_TOKEN_KEY = 'refresh_token'
JWT_EXPIRATION_KEY = 'exp'
DECODING_OPTIONS = {'verify_exp': False}
HASH_ALGORITHM = 'HS256'
TOKEN_STRING_ENCODING = "utf-8"


class ExpiredSignatureError(Exception):
    pass


class AuthGuard:

    @staticmethod
    def decode_token(token):
        return jwt.decode(token, SECRET, algorithm=HASH_ALGORITHM, options=DECODING_OPTIONS)

    @staticmethod
    def check_token_expired(encoded_token):
        decoded_auth_token = AuthGuard.decode_token(encoded_token)
        current_time = datetime.now()
        auth_token_time = decoded_auth_token[JWT_EXPIRATION_KEY]
        expired = datetime.fromtimestamp(auth_token_time / 1e3) > current_time

        if expired:
            raise ExpiredSignatureError

        return decoded_auth_token

    @staticmethod
    def encode_token(payload):
        return jwt.encode(payload, SECRET, algorithm=HASH_ALGORITHM).decode(TOKEN_STRING_ENCODING)

    @staticmethod
    def auth_response(user):
        expiry_time = datetime.now() + timedelta(minutes=1)
        encoded_jwt = AuthGuard.encode_token({
            'id': user['id'],
            JWT_EXPIRATION_KEY: expiry_time
        })
        refresh_token = AuthGuard.encode_token({
            TOKEN_KEY: encoded_jwt,
            'id': user['id']
        })
        response_data = {
            TOKEN_KEY: encoded_jwt,
            REFRESH_TOKEN_KEY: refresh_token,
            'User': user
        }
        return response_data

    @staticmethod
    def authenticate(payload):
        if TOKEN_KEY in payload:
            token = payload[TOKEN_KEY]
        else:
            raise Exception

        decoded_auth_token = AuthGuard.decode_token(token)
        user_id = str(decoded_auth_token['id'])

        return user_id
