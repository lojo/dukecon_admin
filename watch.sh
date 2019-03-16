#!/usr/bin/env bash

# watch the java files and continously deploy the service
mvn clean package -Platest,docker-build
skaffold run -p dev
reflex -v \
    -g '*.js' \
    -g '*.css' \
    -g '*.html' \
    -g '*.json' \
    -g '*.gif' \
    -g '*.png' \
    -g '*.jpg' \
    -- bash -c 'mvn package -Platest,docker-build && skaffold run -p dev'
