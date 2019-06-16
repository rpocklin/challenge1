import { Controller, Module, Get } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller('rates/today')
@Module({
    providers: [RatesService],
  })
export class RatesController {

    constructor(private readonly ratesService: RatesService) {}

    @Get()
    findAll(): any {
        return this.ratesService.getAll();
    }
}
