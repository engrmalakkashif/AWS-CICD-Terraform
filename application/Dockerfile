FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/Healthcare.Api/Healthcare.Api.csproj src/Healthcare.Api/
RUN dotnet restore src/Healthcare.Api/Healthcare.Api.csproj

COPY src/Healthcare.Api/ src/Healthcare.Api/
RUN dotnet publish src/Healthcare.Api/Healthcare.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /out \
    /p:UseAppHost=false

FROM build AS test
COPY tests/Healthcare.Api.Tests/Healthcare.Api.Tests.csproj tests/Healthcare.Api.Tests/
RUN dotnet restore tests/Healthcare.Api.Tests/Healthcare.Api.Tests.csproj
COPY tests/Healthcare.Api.Tests/ tests/Healthcare.Api.Tests/
RUN dotnet test tests/Healthcare.Api.Tests/Healthcare.Api.Tests.csproj \
    --configuration Release \
    --no-restore \
    --logger "console;verbosity=minimal"

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /out .
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
USER $APP_UID
ENTRYPOINT ["dotnet", "Healthcare.Api.dll"]
