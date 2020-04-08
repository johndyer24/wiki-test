#!/bin/sh
nohup docker-compose up --build server-dev > ./docker-compose-output.log &
