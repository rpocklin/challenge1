import { Module } from '@nestjs/common';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [RatesModule],
})
export class AppModule {}
