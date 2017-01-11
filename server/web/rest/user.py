__author__ = 'wubinhong'

import random
import string
from hashlib import md5
from flask import request, jsonify

from web import app
from .auth import authorize
from web.services.users import users


@app.route("/users", methods=["POST"])
@authorize
def create_users():
    apikey = ''.join(
        random.choice(string.ascii_letters+string.digits) for _ in range(32))
    user_params = request.get_json()
    user_params["password"] = \
        md5(user_params["password"].encode("utf-8")).hexdigest().upper()
    # users.create(apikey=apikey, **user_params)
    return jsonify(dict(code=0))

