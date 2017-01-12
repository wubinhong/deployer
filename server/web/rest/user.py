__author__ = 'wubinhong'

import random
import string
from hashlib import md5
from flask import request, jsonify
from sqlalchemy import or_

from .auth import authorize
from web import app
from web.utils.error import Error
from web.models.users import Users
from web.services.users import users
from web.utils.params import get_page, get_size, get_order_by, get_desc


@app.route('/user/stats', methods=['GET'])
@authorize
def user_stats():
    return jsonify(dict(code=0, data=dict(total=users.count())))


@app.route('/users', methods=['GET'])
@authorize
def get_users():
    keyword = request.args.get('keyword', '')
    page = get_page()
    size = get_size()
    criterion = or_(Users.name.like('%' + keyword + '%'), Users.phone.like('%' + keyword + '%'))
    user_list = users.all(offset=page * size, limit=size, order_by=get_order_by(), desc=get_desc(),
                          criterion=criterion)
    total = users.count(criterion=criterion)
    # remove sensitive attr
    for user in user_list:
        delattr(user, 'password')
    return jsonify(dict(code=0, data=dict(total=total, content=user_list)))


@app.route("/users", methods=["POST"])
@authorize
def create_users():
    apikey = ''.join(
        random.choice(string.ascii_letters+string.digits) for _ in range(32))
    user_params = request.get_json()
    user_params["password"] = \
        md5(user_params["password"].encode("utf-8")).hexdigest().upper()
    users.create(apikey=apikey, **user_params)
    return jsonify(dict(code=0))


@app.route('/users/<int:id>/password', methods=['PATCH'])
@authorize
def reset_password(id):
    password = request.data
    # print(repr(password.decode('utf-8').encode("utf-8")))
    # print(repr(password))     # here password is byte type
    # validation
    if not password:
        raise Error(10000, 'new_password required!')
    user = users.first(id=id)
    if user is None:
        raise Error(13001)
    # update password（因为传过来的接收到的是字节，不需要以utf8编码decode成字节再md5）
    password = md5(password).hexdigest().upper()
    users.update(user, password=password)
    # response
    return jsonify(dict(code=0, msg='密码更新成功！'))


