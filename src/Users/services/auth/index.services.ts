import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaServices } from 'prisma/service';
import { RegistUserDto } from '../../dto/regist.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/Users/dto/login.dto';
import { ACCES_SECRET } from 'src/Users/utils';
import * as argon2 from 'argon2';

@Injectable()
export class AuthServices {
  constructor(
    private readonly prisma: PrismaServices,
    private readonly jwt: JwtService,
  ) {}

  async create(registDto: RegistUserDto): Promise<any> {
    const { fullname, email, phone_number, password } = registDto;

    const userExist = await this.prisma.user.findUnique({ where: { email } });

    if (userExist) {
      throw new BadRequestException('user already exist');
    }

    const pass = await this.hashPass(password);

    await this.prisma.user.create({
      data: {
        fullname,
        email,
        phone_number,
        pass,
      },
    });

    return { message: 'signup was succesful' };
  }

  async login(loginDto: LoginUserDto) {
    const { email, pass } = loginDto;

    const foundUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    const isMatch = await this.prisma.user.findFirst({
      where: {
        pass,
      },
    });

    const token = await this.signToken({
      email: foundUser.email,
      pass: foundUser.pass,
    });

    if (!foundUser) {
      throw new BadRequestException('email not found');
    }
    if (!isMatch) {
      throw new BadRequestException('password salah');
    }

    if (!token) {
      throw new ForbiddenException();
    }
    return { message: 'login succesfully', token };
  }

  // async getUsers() {
  //   return await this.prisma.user.findMany({
  //     select: {
  //       fullname: true,
  //       email: true,
  //       phone_number: true,
  //     },
  //   });
  // }

  async signToken(args: { pass: string; email: string }) {
    const payload = args;

    return this.jwt.signAsync(payload, { secret: ACCES_SECRET });
  }

  async hashPass(pass: string) {
    const hashPassword = await argon2.hash(pass);
    return hashPassword;
  }

  async comparePassword(args: { pass: string; hash: string }) {
    return await argon2.verify(args.pass, args.hash);
  }
}
