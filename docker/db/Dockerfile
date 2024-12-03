FROM postgres:17.2-alpine3.20

# Default values for environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=postgres

HEALTHCHECK --interval=60s --timeout=30s --retries=5 --start-period=3s CMD [ 'pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB' ]

EXPOSE 5432
