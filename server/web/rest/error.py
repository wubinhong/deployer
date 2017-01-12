__author__ = 'wubinhong'

from flask import jsonify

from web import app
from web.utils.error import Error
from web.utils.log import Logger


logger = Logger("web.rest.error")


@app.errorhandler(Error)
def error(err):
    logger.warn(repr(err))
    return jsonify(dict(code=err.code,  msg=err.msg))


@app.errorhandler(500)
def error(err):
    logger.error(err)
    return jsonify(dict(code=50000,  msg='Internal Server Error!')), 500
