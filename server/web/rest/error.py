__author__ = 'wubinhong'

from flask import jsonify

from web import app
from web.utils.error import Error


@app.errorhandler(Error)
def error(err):
    return jsonify(dict(code=err.code,  msg=err.msg))
