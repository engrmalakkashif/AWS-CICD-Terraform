# API Starter

The first implementation slice is a .NET 10 minimal API with readiness/liveness endpoints and an integration-test project. Business endpoints, authentication, database access, and PHI handling are intentionally not implemented until their requirements are approved.

## Build and test

From the repository root:

```bash
docker build --target test -f application/Dockerfile application
docker build --target runtime -t healthcare-api:local -f application/Dockerfile application
docker run --rm -p 8080:8080 healthcare-api:local
```

In another terminal, verify:

```bash
curl --fail http://localhost:8080/health
curl --fail http://localhost:8080/health/live
```

The runtime image listens on port `8080` and runs as the non-root user from the official ASP.NET runtime image. Do not add credentials to Docker build arguments or image layers.
