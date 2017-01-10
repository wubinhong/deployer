__author__ = 'Binghong Wu'

from flask import request, jsonify, g

from web import app
from web.utils.error import Error

@app.errorhandler(Error)
def error(err):
    return jsonify(dict(rc=err.rc, msg=err.msg))

@app.route("/api/hello", methods=["GET"])
def api_hello():
    # return jsonify(dict(rc=0, data=dict(id=deploy.id)))
    return jsonify(dict(rc=0, data=dict(id=2, msg='good')))