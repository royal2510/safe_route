# Safe Route AI

A polished full-stack DevSecOps web app for Jenkins pipeline assessment.

## Included

- Good-looking frontend dashboard
- Register and login forms
- JWT authentication
- MongoDB route database
- Create, read, update, delete route records
- Seed demo database data
- Health monitoring endpoint
- Jest/Supertest tests
- Docker and Docker Compose
- Jenkinsfile with 7 stages

## Run with Docker Compose

```bash
docker compose up -d --build
docker exec safe-route-ai npm run seed
```

Open:

```text
http://localhost:3000
```

Demo login:

```text
demo@saferoute.com
password123
```

## Test database functions

1. Login with the demo user.
2. Click Load Database Routes.
3. Create a route using the form.
4. Edit a route.
5. Delete a route.
6. Check /health.
