# Battleship

Monorepo for Battleship API and UI.

## Running the project

### Docker Build

```bash
cd ROOT_OF_PROJECT
docker build -t battleship-backend -f docker/backend/Dockerfile .
docker build -t battleship-frontend -f docker/frontend/Dockerfile .
docker build -t battleship-db -f docker/db/Dockerfile .
```
