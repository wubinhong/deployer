#!/usr/bin/env python3

__author__ = 'wubinhong'

import time
from fabric.api import local, settings, run, cd, lcd, env, put
from fabric.contrib.project import rsync_project

# 自定义变量
repo_dir = '/data/release/platform/backend'
daemon_file = 'daemon.sh'
dest_dir = '/data/dist/dynamic/backend'

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


def prepare_deploy(branch, commit):
    print('repo_dir: %s' % repo_dir)
    print('branch: %s' % branch)
    print('commit: %s' % commit)
    with settings(warn_only=True):
        if local('test -d %s' % repo_dir).failed:
            local('git clone git@gitlab.dandanlicai.com:platform/backend.git %s' % repo_dir)
    with lcd(repo_dir):
        local('git checkout master')
        local('git pull origin')
        local('git checkout %s' % branch)
        local('git pull origin')
        local('git remote prune origin')
        local('git reset --hard ' % commit)
        local('git clean -f -d')    # clean files and directory not exists in git remote repo


def deploy(profile: str='dev', branch: str='dev', commit: str=None, services: str=None, apps: str=None):
    """
    部署所有的后台项目
    :param profile: 环境名称
    :param branch: git分支
    :param services: 要部署的services服务，多个服务以:分隔，如：account:sns:admin
    :param apps: 要部署的apps服务器，多个server以:分隔，如：api:standalone:admin
    :return:
    """
    start_time = time.time()
    print_deploy_info(profile, branch)
    deploy_services(profile, branch, commit, services)
    deploy_apps(profile, branch, commit, apps)
    print("--- cost time: %s seconds ---" % (time.time() - start_time))


def deploy_apps(profile: str, branch: str, commit: str, apps: str):
    """
    部署后台接入apps
    :param profile: 环境名称
    :param branch: git分支
    :param commit: 分支的commit
    :param apps: 要部署的apps
    :return:
    """
    if not apps:
        print('*' * 80)
        print('* servers not defined, skip!')
        print('*' * 80)
        return
    prepare_deploy(branch, commit)
    for app in apps.split(':'):
        project_dir = repo_dir + '/apps/' + app + '-server'
        daemon_shell = local('pwd', capture=True) + '/' + daemon_file
        with lcd(project_dir):
            # build project
            local('gradle clean bootRepackage')
            # sync runnable jar to remote server
            remote_dir = dest_dir + '/apps/' + app + '/'
            jar_file = 'dandan-' + app + '-server.jar'
            rsync_project(remote_dir=remote_dir, local_dir='build/libs/%s' % jar_file)
            # launch server by executing remote shell command
            with cd(remote_dir):
                # restart the jvm
                ## sync shell to remote server
                put(daemon_shell, remote_dir)
                ## execute daemon shell
                remote_daemon_shell = remote_dir + daemon_file
                run('chmod 755 %s' % remote_daemon_shell)
                run('%s %s %s' % (remote_daemon_shell, profile, jar_file), pty=False)
                # run('rm %s' % daemon_file)
                new_pid = run('cat pid', pty=False)
                print('*' * 80)
                print('* project release successfully with new pid [ %s ] !' % new_pid)
                print('*' * 80 + '\n')


def deploy_services(profile: str, branch: str, commit: str, services: str):
    """
    部署后台RPC服务 - service-account项目工程
    :param profile: 环境名称
    :param branch: git分支
    :param commit: 分支的commit
    :param services: 要部署的services
    :return:
    """
    if not services:
        print('*' * 80)
        print('* services not defined, skip!')
        print('*' * 80)
        return
    prepare_deploy(branch, commit)
    for service in services.split(':'):
        project_dir = repo_dir + '/services/' + service + '-center'
        daemon_shell = local('pwd', capture=True) + '/' + daemon_file
        with lcd(project_dir):
            # build project
            local('gradle clean bootRepackage')
            # sync runnable jar to remote server
            remote_dir = dest_dir + '/services/' + service + '-center/'
            jar_file = 'dandan-' + service + '-center.jar'
            rsync_project(remote_dir=remote_dir, local_dir='build/libs/%s' % jar_file)
            # launch server by executing remote shell command
            with cd(remote_dir):
                # restart the jvm
                ## sync shell to remote server
                put(daemon_shell, remote_dir)
                ## execute daemon shell
                remote_daemon_shell = remote_dir + daemon_file
                run('chmod 755 %s' % remote_daemon_shell)
                run('%s %s %s' % (remote_daemon_shell, profile, jar_file), pty=False)
                # run('rm %s' % daemon_file)
                new_pid = run('cat pid', pty=False)     # 加pty=False，防止得到的值前面包含一堆shell响应符
                print('*' * 80)
                print('* project release successfully with new pid [ %s ] !' % new_pid)
                print('*' * 80 + '\n')
