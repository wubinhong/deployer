__author__ = 'wubinhong'

import time
import json
from collections import OrderedDict
from flask import g, request, jsonify

from web import app
from web.utils.error import Error
from web.utils.log import Logger

logger = Logger("web.rest.filter").logger


@app.before_request
def log_request_before():
    g.request_start = time.time()


@app.after_request
def log_request_info(response):
    # logger.debug('api access stats: \nHeaders: %20s', request.headers)
    headers = request.headers

    stats_info = OrderedDict()
    stats_info['from'] = request.remote_addr
    stats_info['req'] = '%s %s' % (request.method, request.path)
    stats_info['req_query'] = request.query_string
    stats_info['req_args'] = request.args
    stats_info['req_body'] = request.get_data()
    stats_info['X-Dandan-Client'] = headers.get('X-Dandan-Client')
    stats_info['X-Dandan-Token'] = headers.get('X-Dandan-Token')
    stats_info['time_cost'] = time.time() - g.request_start
    stats_info['res'] = json.loads(str(response.data, 'utf-8'))

    logger.info('api access stats: \nAccess Detail Stats: \n%s', pretty_map(stats_info))
    return response


def pretty_map(stats_map):
    map_2_str = ''
    for k, v in stats_map.items():
        map_2_str += '%20s : %s\n' % (k, v)
    return map_2_str


@app.errorhandler(Error)
def error(err):
    logger.warn(repr(err))
    return jsonify(dict(code=err.code,  msg=err.msg))


@app.errorhandler(500)
def error(err):
    logger.error(err)
    return jsonify(dict(code=50000,  msg='Internal Server Error!')), 500
