#!/usr/bin/env python3

__author__ = 'wubinhong'

import time
from fabric.api import local, settings, run, cd, lcd, env, put
from fabric.contrib.project import rsync_project

# 使用fabric进行远程发布
# 自定义变量
repo_dir = '/data/release/frontend/wechat'
daemon_file = 'daemon.sh'

# 默认hosts（如果在命令行指定的话）
if len(env.hosts) == 0:
    env.hosts = ['121.40.180.174:20094']


def print_deploy_info(profile='dev', branch='dev'):
    print(env.hosts, env.user)
    print('\n' + '*' * 80)
    print('* 发布环境[profile]: %s' % profile)
    print('* 本地仓库地址[repo_dir]: %s' % repo_dir)
    print('* 发布分支[branch]: %s' % branch)
    print('* 目标主机[hosts]: %s' % env.hosts)
    print('* 目标主机用户[user]: %s' % env.user)
    print('*' * 80 + '\n')


def prepare_deploy(branch):
    print('repo_dir: %s' % repo_dir)
    print('branch: %s' % branch)
    with settings(warn_only=True):
        if local('test -d %s' % repo_dir).failed:
            local('git clone git@gitlab.dandanlicai.com:frontend/wechat.git %s' % repo_dir)
    with lcd(repo_dir):
        local('git checkout master')
        local('git pull origin')
        local('git checkout %s' % branch)
        local('git pull origin')


def deploy(profile='dev', branch='dev_v1.2'):
    """
    部署项目组
    :param profile: 环境名称
    :param branch: 发布的分支名称
    :return:
    """
    start_time = time.time()
    print_deploy_info(profile, branch)
    prepare_deploy(branch)
    daemon_shell = local('pwd', capture=True) + '/' + daemon_file
    with lcd(repo_dir):
        local('npm install')
        local('bower install')
        local('NODE_ENV=%s gulp' % profile)
        remote_dir = '/data/dist/static/wechat'
        # pre install all dependencies
        with lcd('dist/'):
            local('npm install --production')
            with lcd('..'):
                rsync_project(remote_dir=remote_dir, local_dir='dist/')
                # launch server by executing remote shell command
                with cd(remote_dir):
                    # restart the node server process
                    put(daemon_shell, remote_dir)
                    ## execute daemon shell
                    remote_daemon_shell = remote_dir + '/' + daemon_file
                    run('chmod 755 %s' % remote_daemon_shell)
                    run('%s %s' % (remote_daemon_shell, profile), pty=False)
                    # run('rm %s' % daemon_file)
                    new_pid = run('cat pid', pty=False)     # 加pty=False，防止得到的值前面包含一堆shell响应符
                    print('*' * 80)
                    print('* project release successfully with new pid [ %s ] !' % new_pid)
                    print('*' * 80 + '\n')
    print("--- cost time: %s seconds ---" % (time.time() - start_time))
