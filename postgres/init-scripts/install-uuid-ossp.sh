#!/bin/sh

psql \
  -d "Aracardi" \
  -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    SCHEMA "public"
    VERSION "1.1"'
