#!/bin/sh

psql \
  -d "cards" \
  -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    SCHEMA "public"
    VERSION "1.1"'
