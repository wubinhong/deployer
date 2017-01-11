__author__ = 'Binghong Wu'

from flask import request, jsonify

from web import app
from web.utils.error import Error


@app.route("/api/hello", methods=["GET"])
def api_hello():
    print('header: ', request.headers['User-Agent'])
    print('kevin: ', request.args)
    print('kevin: ', request.args.get('name'))
    print('query_string: %s' % request.query_string)
    print('query_string:', request.query_string)
    print('query_string:', request.args.get('name'))
    if request.args.get('name'):
        raise Error(10000, msg=None)
    else:
        return jsonify(dict(rc=0, data=dict(id=2, msg='good')))



