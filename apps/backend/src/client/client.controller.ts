import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create')
  async create(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('dob') dob: string,
  ) {
    return this.clientService.createClient(firstName, lastName, email, dob);
  }

  @Post('check')
  async createDocumentCheck(
    @Body('clientId') clientId: string,
    @Body('documentId') documentId: string,
  ) {
    return await this.clientService.createDocumentCheck(clientId, documentId);
  }

  @Get('check')
  async getIdentityCheck(
    @Query('checkId') checkId: string,
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
    @Query('dob') dob: string,
  ) {
    if (!checkId || !firstName || !lastName || !dob) {
      throw new BadRequestException('Missing required query parameters');
    }

    return await this.clientService.verifyIdentity(
      checkId,
      firstName,
      lastName,
      dob,
    );
  }
}
