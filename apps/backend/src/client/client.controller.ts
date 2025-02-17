import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  CreateClientDto,
  CreateDocumentCheckDto,
  GetIdentityCheckDto,
} from './client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() body: CreateClientDto) {
    return this.clientService.createClient(
      body.firstName,
      body.lastName,
      body.email,
      body.dob,
    );
  }

  @Post('check')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createDocumentCheck(@Body() body: CreateDocumentCheckDto) {
    return await this.clientService.createDocumentCheck(
      body.clientId,
      body.documentId,
    );
  }

  @Get('check')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getIdentityCheck(@Query() query: GetIdentityCheckDto) {
    return await this.clientService.verifyIdentity(
      query.checkId,
      query.firstName,
      query.lastName,
      query.dob,
    );
  }
}
