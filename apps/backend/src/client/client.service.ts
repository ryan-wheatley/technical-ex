import { Injectable } from '@nestjs/common';
import { ComplyCube } from '@complycube/api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientService {
  private complycube: ComplyCube;

  constructor(private configService: ConfigService) {
    this.complycube = new ComplyCube({
      apiKey: this.configService.get<string>('COMPLYCUBE_API_KEY'),
    });
  }

  async createClient(
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
  ) {
    try {
      const client = await this.complycube.client.create({
        type: 'person',
        email,
        personDetails: { firstName, lastName, dob },
      });

      const token = await this.complycube.token.generate(client.id, {
        referrer: '*://*/*',
      });

      return { client, token };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createDocumentCheck(clientId: string, documentId: string) {
    try {
      return await this.complycube.check.create(clientId, {
        documentId,
        type: 'document_check',
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async verifyIdentity(
    checkId: string,
    firstName: string,
    lastName: string,
    dob: string,
  ) {
    try {
      const checkData = await this.complycube.check.get(checkId);

      if (!checkData) {
        throw new Error('Verification data not found.');
      }

      let parsedResult;
      if (typeof checkData.result === 'string') {
        parsedResult = JSON.parse(checkData.result);
      } else {
        parsedResult = checkData.result;
      }

      if (checkData.status !== 'complete') {
        return {
          status: checkData.status,
          outcome: parsedResult.outcome,
        };
      }

      const extractedData =
        parsedResult?.breakdown.extractedData?.holderDetails;

      if (!extractedData) {
        throw new Error('No extracted document data found.');
      }

      console.log('Extracted Data:', extractedData);

      const firstNameMatch = extractedData.firstName.some(
        (name: string) => name.toUpperCase() === firstName.toUpperCase(),
      );

      const lastNameMatch = extractedData.lastName.some(
        (name: string) => name.toUpperCase() === lastName.toUpperCase(),
      );

      const userDobParts = dob.split('-');
      const userDob = {
        year: parseInt(userDobParts[0]),
        month: parseInt(userDobParts[1]),
        day: parseInt(userDobParts[2]),
      };

      const dobMatch =
        extractedData.dob?.day === userDob.day &&
        extractedData.dob?.month === userDob.month &&
        extractedData.dob?.year === userDob.year;

      return {
        status: 'complete',
        outcome: firstNameMatch && lastNameMatch && dobMatch ? 'clear' : 'fail',
      };
    } catch (error) {
      throw new Error(`Verification failed: ${error.message}`);
    }
  }
}
