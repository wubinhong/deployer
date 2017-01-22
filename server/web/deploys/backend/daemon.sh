#!/usr/bin/env bash
# Copyright Dandan corp & Hucat corp & Binhong.Wu
# This file will be copied to remote server and launch a jvm as daemon process

# get profile by args
profile=$1
jar_file=$2

# kill old process
cat pid |xargs kill -9

# JAVA_OPTS
JAVA_OPTS="-server -Xms200m -Xmx200m -XX:NewRatio=3 -XX:SurvivorRatio=2 -XX:+UseParallelGC"

# launch new process | Note: security option make jvm launch more quickly!
java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8 -Dspring.profiles.active=$profile -jar ./$jar_file > nohup.out &
echo $! > pid
