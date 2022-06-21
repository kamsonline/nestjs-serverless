#!/bin/bash

aws dynamodb create-table --endpoint-url http://localhost:8000 \
    --table-name tenants-dev \
    --attribute-definitions \
        AttributeName=clientId,AttributeType=S \
    --key-schema \
        AttributeName=clientId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --table-class STANDARD

aws dynamodb update-table --endpoint-url http://localhost:8000 \
    --table-name tenants-dev \
    --attribute-definitions \
        AttributeName=tenantName,AttributeType=S \
    --global-secondary-index-updates \
        "[{\"Create\":{\"IndexName\": \"tenantNameIndex\",\"KeySchema\":[{\"AttributeName\":\"tenantName\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5 },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]"

aws dynamodb update-table --endpoint-url http://localhost:8000 \
    --table-name tenants-dev \
    --attribute-definitions \
        AttributeName=clientReference,AttributeType=S \
    --global-secondary-index-updates \
        "[{\"Create\":{\"IndexName\": \"clientReferenceIndex\",\"KeySchema\":[{\"AttributeName\":\"clientReference\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5 },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]"