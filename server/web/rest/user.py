__author__ = 'wubinhong'

import random
import string
from hashlib import md5
from flask import request, jsonify, g
from sqlalchemy import or_, and_

from .auth import authorize
from web import app
from web.utils.error import Error
from web.utils.log import Logger
from web.models.users import Users
from web.services.users import users
from web.utils.params import get_page, get_size, get_order_by, get_desc

logger = Logger("web.rest.user").logger

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


@app.route('/user/<int:id>/password', methods=['PATCH'])
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

# 获取某个用户的信息
@app.route("/user/<int:id>", methods=["GET"])
@authorize
def api_get_user_by_id(id):
    logger.info('get user info[%s]' % id)
    return jsonify(dict(code=0, data=users.get(id)))


# 更新某个信息的信息
@app.route('/user/<int:id>', methods=['PUT'])
@authorize
def update_user_by_id(id):
    user_params = request.get_json()
    user_db = users.get(id)
    users.update(user_db, **user_params)
    return jsonify(dict(code=0, msg='用户信息更新成功！'))


@app.route("/users", methods=["POST"])
@authorize
def create_users():
    apikey = ''.join(
        random.choice(string.ascii_letters+string.digits) for _ in range(32))
    user_params = request.get_json()
    exist_user = users.find(name=user_params['name'])
    if exist_user is not None:
        raise Error(13002)
    user_params["password"] = \
        md5(user_params["password"].encode("utf-8")).hexdigest().upper()
    users.create(apikey=apikey, **user_params)
    return jsonify(dict(code=0))


@app.route("/user/<ids>", methods=["DELETE"])
@authorize
def delete_by_id(ids):
    for id in ids.split(','):
        users.delete(id)
    return jsonify(dict(code=0, msg='删除成功！'))


@app.route("/user/me", methods=["PUT"])
@authorize
def update_me():
    user_params = request.get_json()
    new_name = user_params.get('name')
    criterion = and_(Users.id != g.user.id, Users.name == new_name)
    if users.count(criterion=criterion) > 0:
        # return jsonify(dict(code=13002, msg='登录名%s已经被占用了！' % new_name))
        raise Error(13002, '登录名%s已经被占用了！' % new_name)

    users.update(g.user,
                 name=new_name, apikey=user_params.get('apikey'), email=user_params.get('email'),
                 gender=user_params.get('gender'), nick=user_params.get('nick'), phone=user_params.get('phone'))
    return jsonify(dict(code=0, msg='更新成功！'))


@app.route("/user/me/password", methods=["PATCH"])
@authorize
def change_password():
    params = request.get_json()
    users.change_user_password(g.user.id, params.get('oldPassword'), params.get('newPassword'))
    return jsonify(dict(code=0, msg='密码修改成功！'))

