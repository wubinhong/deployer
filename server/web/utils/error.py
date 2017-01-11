# -*- coding:utf-8 -*-
__author__ = 'Binhong Wu'


class Error(Exception):
    MAPS = {
        10000: "income parameters error",
        10001: "project not exists.",
        10002: "host not exists.",
        10003: "user not exists.",
        10004: "deploy permission denied.",
        10005: "Incomplete parameter",
        # 远端shell部分
        11000: "pre deploy shell called exception",
        11001: "post deploy shell called exception",
        11002: "restart shell called exception",
        11003: "rsync called exception",
        # 本地shell部分
        12000: "git repo clone exception",
        # 用户部分
        13000: "username or password incorrect",
        13001: "user not exists",
        13002: "user not login",
        }

    def __init__(self, code, msg=None):
        self.code = code
        if msg is None:
            self.msg = self.MAPS[code]
        else:
            self.msg = msg

    def __repr__(self):
        return "%s: %s" % (self.code, self.msg)
