from functools import wraps

from flask import request, jsonify, g

from web import app
from web.services.users import users
from web.services.sessions import sessions
from web.utils.error import Error

__author__ = 'Binhong Wu'


def authorize(func):
    """
    rest授权注解
    :param func:
    :return:
    """
    @wraps(func)
    def decorator(*args, **kargs):
        apikey = request.args.get("apikey")
        token = request.headers.get('x-dandan-token')
        if users.is_login(token, apikey):
            g.user = users.first(apikey=apikey) or \
                users.get(sessions.first(session=token).user_id)
            if g.user is not None:
                return func(*args, **kargs)
        raise Error(14000)
    return decorator


def session_info(func):
    """
    获取登陆相关的信息
    :param func:
    :return:
    """
    @wraps(func)
    def decorator(*args, **kwargs):
        apikey = request.args.get("apikey")
        token = request.headers.get('x-dandan-token')
        kwargs.setdefault('user', users.get_user_info(token, apikey))
        return func(*args, **kwargs)
    return decorator


@app.route("/auth/login", methods=["POST"])
def auth_login():
    body = request.get_json()
    login_info = users.login(body['username'], body['password'])
    return jsonify(dict(code=0, data=login_info))


@app.route("/auth/logout", methods=['PUT'])
@authorize
def logout():
    users.logout(g.user)
    return jsonify(dict(code=0, msg='logout successfully'))

