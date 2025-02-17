import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ClientService } from './client.service';
import { ComplyCube } from '@complycube/api';

jest.mock('@complycube/api');

describe('ClientService', () => {
  let service: ClientService;
  let mockComplyCube: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockConfigService = { get: jest.fn().mockReturnValue('test-api-key') };
    mockComplyCube = {
      client: { create: jest.fn() },
      token: { generate: jest.fn() },
      check: { create: jest.fn(), get: jest.fn() },
    };

    (ComplyCube as jest.Mock).mockImplementation(() => mockComplyCube);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a client and return client and token', async () => {
    const mockClient = { id: '123', email: 'test@example.com' };
    const mockToken = { token: 'test-token' };

    mockComplyCube.client.create.mockResolvedValue(mockClient);
    mockComplyCube.token.generate.mockResolvedValue(mockToken);

    const result = await service.createClient(
      'John',
      'Doe',
      'test@example.com',
      '1990-01-01',
    );
    expect(mockComplyCube.client.create).toHaveBeenCalledWith({
      type: 'person',
      email: 'test@example.com',
      personDetails: { firstName: 'John', lastName: 'Doe', dob: '1990-01-01' },
    });
    expect(mockComplyCube.token.generate).toHaveBeenCalledWith('123', {
      referrer: '*://*/*',
    });
    expect(result).toEqual({ client: mockClient, token: mockToken });
  });

  it('should create a document check', async () => {
    const mockCheck = { id: 'check123', status: 'pending' };
    mockComplyCube.check.create.mockResolvedValue(mockCheck);

    const result = await service.createDocumentCheck('client123', 'doc456');
    expect(mockComplyCube.check.create).toHaveBeenCalledWith('client123', {
      documentId: 'doc456',
      type: 'document_check',
    });
    expect(result).toEqual(mockCheck);
  });

  it('should verify identity and return verification result', async () => {
    const mockCheckData = {
      status: 'complete',
      result: {
        breakdown: {
          extractedData: {
            holderDetails: {
              firstName: ['John'],
              lastName: ['Doe'],
              dob: { year: 1990, month: 1, day: 1 },
            },
          },
        },
      },
    };
    mockComplyCube.check.get.mockResolvedValue(mockCheckData);

    const result = await service.verifyIdentity(
      'check123',
      'John',
      'Doe',
      '1990-01-01',
    );
    expect(mockComplyCube.check.get).toHaveBeenCalledWith('check123');
    expect(result).toEqual({ status: 'complete', outcome: 'clear' });
  });

  it('should return verification failure if data does not match', async () => {
    const mockCheckData = {
      status: 'complete',
      result: {
        breakdown: {
          extractedData: {
            holderDetails: {
              firstName: ['Jane'],
              lastName: ['Doe'],
              dob: { year: 1990, month: 1, day: 1 },
            },
          },
        },
      },
    };
    mockComplyCube.check.get.mockResolvedValue(mockCheckData);

    const result = await service.verifyIdentity(
      'check123',
      'John',
      'Doe',
      '1990-01-01',
    );
    expect(result).toEqual({ status: 'complete', outcome: 'fail' });
  });
});
