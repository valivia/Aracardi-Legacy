
# Docker-Compose for db

To start
```
docker-compose -f docker-compose.yml up -d
```

To push prisma schema
```
npx prisma db push 
```

To kill (and remove volumes (WILL PURGE DB))
```
docker-compose down --volumes
```

