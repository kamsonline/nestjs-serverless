import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, Version } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Version('1')
  @Get()
  async getAllClients(@Res() res: any) {
    try {
      const client: any = await this.clientService.getAllClients();
      if (client.ok) {
        return res.status(HttpStatus.OK).json(client.data);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Unable to get clients`,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error Trying to reach DB',
        errors: error,
      });
    }
  }

  @Version('1')
  @Post()
  async createTenant(@Body() clientDto: ClientDto, @Res() res: any) {
    try {
      try {
        const client: any = await this.clientService.getClientById(clientDto.clientId);
        if (client.ok) {
          // Client already exists
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Client already exists.',
          });
        }
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error Trying to reach DB',
          errors: error,
        });
      }

      try {
        const clientReferenceExists: any = await this.clientService.isClientReferenceExists(clientDto.clientReference);
        if (clientReferenceExists) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Client Referencce already exists.',
          });
        }
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error Trying to reach DB',
          errors: error,
        });
      }

      const newClient: any = await this.clientService.updateClient(clientDto);
      if (newClient.ok) {
        return res.status(HttpStatus.CREATED).json(newClient.data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Error Trying to Create Order',
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error Trying to reach DB',
        errors: error,
      });
    }
  }

  @Version('1')
  @Get('/:id')
  async getClientById(@Param('id') id: string, @Res() res: any) {
    try {
      const client: any = await this.clientService.getClientById(id);
      if (client.ok) {
        return res.status(HttpStatus.OK).json(client.data);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Unable to find the client by id ${id}`,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error Trying to reach DB',
        errors: error,
      });
    }
  }

  @Version('1')
  @Put('/:id')
  async updateClientConfiguration(@Param('id') id: string, @Body() clientDto: ClientDto, @Res() res: any) {
    if (clientDto.clientId !== id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Client Id in the url and body doesn't match`,
      });
    }

    try {
      const client: any = await this.clientService.getClientById(clientDto.clientId);
      if (!client.ok) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Unable to find the client by id ${id}`,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error Trying to reach DB',
        errors: error,
      });
    }

    try {
      const client: any = await this.clientService.getClientByReference(clientDto.clientReference);

      if (client.ok && client.data && client.data.clientId != id) {
        // Client reference already exists under different client id.
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Client reference already exists under the client ${client.data.clientId}`,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error Trying to reach DB',
        errors: error,
      });
    }

    try {
      const client: any = await this.clientService.updateClient(clientDto);
      if (client.ok) {
        return res.status(HttpStatus.OK).json(client.data);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Unable to find the client by id ${id}`,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error Trying to reach DB',
        errors: error,
      });
    }
  }

  @Version('1')
  @Delete('/:id')
  async deleteClientById(@Param('id') id: string, @Res() res: any) {
    try {
      const client: any = await this.clientService.deleteClientById(id);
      if (client.ok) {
        return res.status(HttpStatus.OK).json(undefined);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Unable to find the client by id ${id}`,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error Trying to reach DB',
        errors: error,
      });
    }
  }
}
