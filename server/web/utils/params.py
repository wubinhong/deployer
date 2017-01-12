__author__ = 'wubinhong'

from flask import request


def get_page():
    return request.args.get('page', 0, type=int)


def get_size():
    return request.args.get('size', 0, type=int)


def get_order_by():
    return request.args.get('sorting', '+id')[1:]


def get_desc():
    return request.args.get('sorting', '+id')[0] == '-'