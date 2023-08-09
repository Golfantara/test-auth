import { Module } from '@nestjs/common';
import { AuthServices } from '../services/auth/index.services';
import { AuthController } from '../controllers/auth/index.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaServices } from 'prisma/service';
import { JwtStrategy } from '../strategies/index.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.ACCES_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthServices, PrismaServices, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
