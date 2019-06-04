import { Test, TestingModule } from '@nestjs/testing';
import { RatesService, RATES } from './rates.service';

describe('RatesService', () => {
  let service: RatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatesService],
    }).compile();

    service = module.get<RatesService>(RatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return the current rates', () => {
      expect(service.getAll()).toEqual(RATES);
    });
  });
});
