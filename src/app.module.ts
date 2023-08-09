import { Module } from '@nestjs/common';
import { AuthController } from './Users/controllers';
import { AuthServices } from './Users/services';
import { AuthModule } from './Users/modules/index.module';
import { PrismaModule } from 'prisma/module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthServices],
})
export class AppModule {}
