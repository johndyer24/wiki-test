#!/bin/sh
nohup docker-compose up --build server-prod > ./docker-compose-output.log &
exit 0
