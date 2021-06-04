__author__ = 'Binghong Wu'

from flask import request, jsonify

from .auth import authorize, session_info
from web import app


@app.route("/deploy/profiles", methods=["GET"])
@authorize
@session_info
def deploy_profiles(user):
    print('user: ', user)
    print('user.id: ', user.id)
    return jsonify(dict(code=0, data=dict(id=2, message='good')))


