from datetime import datetime
import sys
import time
import random
import string
from hashlib import md5

from web import db
from web.utils.log import Logger
from web.models.users import Users
# from web.services.hosts import hosts
# from web.services.projects import projects

from .base import Base
from web.utils.error import Error
from .sessions import sessions

logger = Logger("web.services.users")
__author__ = 'Binhong Wu'


class UsersService(Base):
    __model__ = Users

    def login(self, username, password):
        password = md5(password.encode("utf-8")).hexdigest().upper()
        user = self.first(name=username, password=password)
        if user is None:
            raise Error(13000)
        session = sessions.first(user_id=user.id)
        expired = datetime.fromtimestamp(time.time() + 24 * 60 * 60).isoformat()
        if session is None:
            token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(20))
            sessions.create(user_id=user.id,
                            session=token,
                            expired=expired)
        else:
            sessions.update(session, expired=expired)
            token = session.session
        return dict(token=token, id=user.id, name=user.name, role=user.role)

    def logout(self, user):
        session = sessions.first(user_id=user.id)
        if session is not None:
            sessions.update(
                session,
                expired=datetime.now().isoformat())

    def is_login(self, session, apikey):
        if users.first(apikey=apikey):  # 使用apikey可以免登陆调用接口
            return True
        session = sessions.first(session=session)
        if session is not None:
            delta = session.expired - datetime.now()
            if (delta.microseconds + (delta.seconds + delta.days * 24 * 3600) *
                    10 ** 6) / 10 ** 6 > 0:
                return True
        return False

    # def get_user_hosts(self, user, **kargs):
    #     if user.role == user.ROLE["ADMIN"]:
    #         return dict(hosts=hosts.all(kargs.get("offset"),
    #                                     kargs.get("limit"),
    #                                     kargs.get("order_by")),
    #                     count=hosts.count())
    #     else:
    #         return dict(hosts=user.hosts.all(),
    #                     count=user.hosts.count())

    # def get_user_projects(self, user, **kargs):
    #     if user.role == user.ROLE["ADMIN"]:
    #         return dict(projects=projects.all(kargs.get("offset"),
    #                                           kargs.get("limit"),
    #                                           kargs.get("order_by")),
    #                     count=projects.count())
    #     else:
    #         return dict(projects=user.projects.all(),
    #                     count=user.projects.count())


users = UsersService()
