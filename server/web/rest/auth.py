from functools import wraps

from flask import request, redirect, jsonify, url_for, g

from web import app
from web.services.users import users
from web.services.sessions import sessions
from web.utils.error import Error

__author__ = 'Binhong Wu'


def authorize(func):
    @wraps(func)
    def decorator(*args, **kargs):
        print('kevin: ', request.args)
        apikey = request.args.get("apikey")
        token = request.headers.get('x-dandan-token')
        if users.is_login(token, apikey):
            g.user = users.first(apikey=apikey) or \
                users.get(sessions.first(session=token).user_id)
            if g.user is not None:
                return func(*args, **kargs)
        raise Error(13002)
    return decorator


@app.route("/auth/login", methods=["POST"])
def api_user_login():
    body = request.get_json()
    token = users.login(body['username'], body['password'])
    return jsonify(dict(code=0, data=dict(token=token)))

@app.route("/auth/logout")
@authorize
def logout():
    users.logout(g.user)
    resp = redirect(url_for('login'))
    resp.set_cookie("sign", "", expires=0)
    return resp

