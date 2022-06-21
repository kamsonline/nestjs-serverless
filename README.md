# Special Tenants Lambda API

## Development

Install the dependencies

```
yarn install
```

## First time DB setup in local

Run the script file

```
docker-compose up db

./src/db/init_database.sh
```

## Setup local environment

Copy the env.example file to create .env file with appropriate settings

## Run the DB and local server

Run the local dynamo DB in local and run the app using yarn

```
docker-compose up db

yarn run start:dev
```

Or launch the dev server in Docker:

```
docker-compose up db app

```

## Serverless Offline

Launches the lambda server using serverless offline

```
# Start the dynamoDB in local
docker-compose up db

# Start the serverless offline
yarn sls offline start

```

## Deployment

```

export AWS_PROFILE=<YOUR_PROFILE>
serverless deploy

```
