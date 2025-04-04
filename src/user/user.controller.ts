import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  NotFoundException,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user-dto';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard.ts';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import {
  ResetUserAdminPasswordDto,
  ResetUserPasswordDto,
} from './dtos/ResetUserPasswordDto';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { CacheInterceptor } from '@nestjs/cache-manager';
@Controller('/api/user')
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() createUserDTO: CreateUserDTO,
  ) {
    const user = await this.userService.updateUser(createUserDTO, id);
    return user;
  }

  @Get('/')
  async findUsers() {
    const user = await this.userService.findlistUsers();
    if (!user) throw new NotFoundException('User does not exist!');
    return user;
  }

  @Post('/email')
  async getuserByEmail(@Body() email: any) {
    const user = await this.userService.findUser(email.email);
    if (!user) throw new NotFoundException('User does not exist!');
    const payload = {
      email: user.profileData.userAbout.email,
      sub: user._id,
      role: user.profileData.role,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { user, token: access_token };
  }

  //**************************************** ADMIN  **********************************************/

  @UseGuards(JwtAuthGuard)
  @Put('/admin/update/password')
  async ResetAdminUserPassword(@Body() restpassDto: ResetUserAdminPasswordDto) {
    const user = await this.userService.ResetAdminUserPassword(restpassDto);
    if (!user) throw new NotFoundException('User does not exist!');
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async DeleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteuser(id);
    if (!user) throw new NotFoundException('User does not exist!');
    return { message: 'USER DELETED ' };
  }

  @Get('/:id')
  async findUsersById(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new NotFoundException('User does not exist!');
    return user;
  }
}
