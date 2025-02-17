import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date format (YYYY-MM-DD)',
  })
  dob: string;
}

export class CreateDocumentCheckDto {
  @IsString({ message: 'Client ID must be a string' })
  @IsNotEmpty({ message: 'Client ID is required' })
  clientId: string;

  @IsString({ message: 'Document ID must be a string' })
  @IsNotEmpty({ message: 'Document ID is required' })
  documentId: string;
}

export class GetIdentityCheckDto {
  @IsString({ message: 'Check ID must be a string' })
  @IsNotEmpty({ message: 'Check ID is required' })
  checkId: string;

  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date format (YYYY-MM-DD)',
  })
  dob: string;
}
