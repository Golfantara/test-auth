import { Global, Module } from '@nestjs/common';
import { PrismaServices } from './service';

@Global()
@Module({
  providers: [PrismaServices],
  exports: [PrismaServices],
})
export class PrismaModule {}
