# -------- Build stage --------
FROM mcr.microsoft.com/dotnet/sdk:10.0
WORKDIR /src

COPY api.csproj ./
RUN dotnet restore

COPY . .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080"]