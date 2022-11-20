#!/bin/sh

psql \
  -d "cardgame" \
  -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    SCHEMA "public"
    VERSION "1.1"'
