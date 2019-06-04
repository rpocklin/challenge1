import { Test, TestingModule } from '@nestjs/testing';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';

describe('Rates Controller', () => {
  let controller: RatesController;
  let service: RatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatesController],
      providers: [RatesService],
    }).compile();

    service = module.get<RatesService>(RatesService);
    controller = module.get<RatesController>(RatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should call the service to retrieve the current rates', () => {
      const result = {};
      jest.spyOn(service, 'getAll').mockImplementation(() => result);
      expect(controller.findAll()).toBe(result);
    });
  });
});
