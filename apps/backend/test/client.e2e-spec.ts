import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ClientService } from '../src/client/client.service';

describe('ClientController (e2e)', () => {
  let app: INestApplication;
  let clientService: ClientService;

  const mockClientService = {
    createClient: jest.fn().mockResolvedValue({
      client: { id: 'mock-client-id' },
      token: 'mock-token',
    }),
    createDocumentCheck: jest.fn().mockResolvedValue({
      id: 'mock-check-id',
      status: 'pending',
    }),
    verifyIdentity: jest.fn().mockResolvedValue({
      status: 'complete',
      outcome: 'clear',
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ClientService)
      .useValue(mockClientService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    clientService = moduleFixture.get<ClientService>(ClientService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/client/create (POST) should create a client', async () => {
    const response = await request(app.getHttpServer())
      .post('/client/create')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        dob: '1990-01-01',
      })
      .expect(201);

    expect(response.body).toEqual({
      client: { id: 'mock-client-id' },
      token: 'mock-token',
    });

    expect(clientService.createClient).toHaveBeenCalled();
  });

  it('/client/check (POST) should create a document check', async () => {
    const response = await request(app.getHttpServer())
      .post('/client/check')
      .send({
        clientId: 'mock-client-id',
        documentId: 'mock-doc-id',
      })
      .expect(201);

    expect(response.body).toEqual({ id: 'mock-check-id', status: 'pending' });
    expect(clientService.createDocumentCheck).toHaveBeenCalled();
  });

  it('/client/check (GET) should return identity verification result', async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/client/check?checkId=mock-check-id&firstName=John&lastName=Doe&dob=1995-10-10',
      )
      .expect(200);

    expect(response.body).toEqual({ status: 'complete', outcome: 'clear' });
    expect(clientService.verifyIdentity).toHaveBeenCalled();
  });
});
