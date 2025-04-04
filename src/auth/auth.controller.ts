import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from '../user/dtos/create-user-dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard.ts';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/auth')
@UseInterceptors(CacheInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.addUser(createUserDTO);
    return user;
  }
  @Post('/add')
  async add(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.addUser(createUserDTO);
    return user;
  }

  @Post('/genToken')
  async genToken() {
    const token = await this.authService.genToken();
    return { token };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
