import { Injectable } from '@nestjs/common';
import { ClientDto } from './client.dto';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  async updateClient(clientDto: ClientDto) {
    const createdClient = await this.clientRepository.updateClient(clientDto);
    return createdClient;
  }

  async getAllClients() {
    const client = await this.clientRepository.getAllClients();
    return client;
  }

  async getClientById(id: any) {
    const client = await this.clientRepository.getClientById(id);
    return client;
  }

  async getClientByReference(reference: any) {
    const client = await this.clientRepository.getClientByReference(reference);
    return client;
  }

  async isClientReferenceExists(reference: any) {
    const client = await this.getClientByReference(reference);
    return client.ok;
  }

  async deleteClientById(id: any) {
    const client = await this.clientRepository.deleteClientById(id);
    return client;
  }
}
