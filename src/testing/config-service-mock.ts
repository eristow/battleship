import { ConfigService } from '@nestjs/config';

export const configServiceMock = {
  provide: ConfigService,
  useValue: {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'BCRYPT_ROUNDS':
          return 10;
        default:
          return null;
      }
    }),
  },
};
