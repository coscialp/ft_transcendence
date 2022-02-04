#!/bin/bash

id=$(docker ps | grep backend | head -c 12)

migrate() {
    docker exec -ti $id yarn migration:run
    rm -rf ./backend/migrations/*
}

migration() {
    docker exec -ti $id yarn migration:generate $1
}

case "$1" in
run)
    docker-compose up -d
    ;;
migration)
    migration $2
    ;;
migrate)
    migrate $2
    ;;
delete)
    docker-compose stop
    docker system prune -a
    ;;
drop)
    docker exec -ti $id yarn schema:drop
    ;;
*)
    echo $1 command not found
    ;;
esac