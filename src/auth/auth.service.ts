import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { abilityToString, decryptString, encryptString } from 'src/utils';
import 'dotenv/config';
import { stringify } from 'querystring';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (user && isPasswordMatch) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      type: user.type,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: access_token,
      user_data: user,
    };
  }

  async genToken() {
    const payload = {
      email: 'gest@gest.com',
      sub: 'a78ùaa14iotr',
      type: 'member',
    };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return access_token;
  }
}
