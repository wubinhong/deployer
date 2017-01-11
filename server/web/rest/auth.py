from functools import wraps

from flask import request, redirect, jsonify, url_for, g

from web import app
from web.services.users import users
from web.services.sessions import sessions

__author__ = 'Binhong Wu'


def authorize(func):
    @wraps(func)
    def decorator(*args, **kargs):
        print('kevin: ', request.args)
        apikey = request.args.get("apikey")
        sign = request.cookies.get('sign')
        if users.is_login(sign, apikey):
            g.user = users.first(apikey=apikey) or \
                users.get(sessions.first(session=sign).user_id)
            if g.user is not None:
                return func(*args, **kargs)
        return redirect(url_for('login', next=request.path))
    return decorator


@app.route("/auth/login", methods=["POST"])
def api_user_login():
    body = request.get_json()
    username = body['username']
    password = body['password']
    sign = users.login(username, password)
    return jsonify(dict(code=0, data=dict(sign=sign)))

@app.route("/auth/logout")
@authorize
def logout():
    users.logout(g.user)
    resp = redirect(url_for('login'))
    resp.set_cookie("sign", "", expires=0)
    return resp

