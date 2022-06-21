import { IsNotEmpty } from 'class-validator';

export class ClientDto {
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  clientReference: string;

  tenantName: string;

  configuration: Array<any>;
}
