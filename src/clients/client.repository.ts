import * as AWS from 'aws-sdk';
import { InternalServerErrorException } from '@nestjs/common';
import { ClientDto } from './client.dto';

export class ClientRepository {
  private dynamoDB: AWS.DynamoDB.DocumentClient;

  constructor() {
    if (process.env.IS_DDB_LOCAL === 'true') {
      this.dynamoDB = new AWS.DynamoDB.DocumentClient({
        region: process.env.REGION,
        endpoint: process.env.DYNAMODB_ENDPOINT,
      });
    } else {
      this.dynamoDB = new AWS.DynamoDB.DocumentClient();
    }
  }

  async updateClient(clientDto: ClientDto) {
    const newClient = {
      clientId: clientDto.clientId,
      clientReference: clientDto.clientReference,
      tenantName: clientDto.tenantName,
      configuration: clientDto.configuration,
    };

    try {
      await this.dynamoDB
        .put({
          TableName: process.env.TENANTS_TABLE_NAME,
          Item: newClient,
        })
        .promise();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }

    return { ok: true, data: newClient };
  }

  async getAllClients() {
    let clients;
    try {
      console.log(process.env.TENANTS_TABLE_NAME);
      const result = await this.dynamoDB
        .scan({
          TableName: process.env.TENANTS_TABLE_NAME,
        })
        .promise();

      clients = result.Items;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }

    if (!clients) {
      return { ok: false, data: null };
    }

    return { ok: true, data: clients };
  }

  async getClientById(id: any) {
    let client;
    try {
      console.log(process.env.TENANTS_TABLE_NAME);
      const result = await this.dynamoDB
        .get({
          TableName: process.env.TENANTS_TABLE_NAME,
          Key: { clientId: id },
        })
        .promise();

      client = result.Item;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }

    if (!client) {
      return { ok: false, data: null };
    }

    return { ok: true, data: client };
  }

  async getClientByReference(clientReference: string) {
    let client;
    try {
      console.log(process.env.TENANTS_TABLE_NAME);
      const result = await this.dynamoDB
        .query({
          TableName: process.env.TENANTS_TABLE_NAME,
          IndexName: 'clientReferenceIndex',
          KeyConditionExpression: 'clientReference = :clientReference',
          ExpressionAttributeValues: {
            ':clientReference': clientReference,
          },
        })
        .promise();

      client = result.Items ? result.Items[0] : undefined;
      console.log(client);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }

    if (!client) {
      return { ok: false, data: null };
    }

    return { ok: true, data: client };
  }

  async deleteClientById(id: any) {
    let deletedClient;
    try {
      const result = await this.dynamoDB
        .delete({
          TableName: process.env.TENANTS_TABLE_NAME,
          Key: { clientId: id },
          ReturnValues: 'ALL_OLD',
        })
        .promise();

      deletedClient = result.Attributes;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }

    if (!deletedClient) {
      return { ok: false, data: null };
    }

    return { ok: true };
  }
}
