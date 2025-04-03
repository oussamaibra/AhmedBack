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
  BadRequestException,
  Ip,
  Headers,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard.ts';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PostService } from './post.service';
import { PostDTO } from './postDTO';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/Post')
@UseInterceptors(CacheInterceptor)
export class PostController {
  constructor(private PostService: PostService) {}

  @Post('/')
  async addPost(@Body() PostDto: PostDTO) {
    const appliaction = await this.PostService.addPost(PostDto);
    return appliaction;
  }
  @Put('/:id')
  async updatePost(@Body() PostDto: PostDTO, @Param('id') id: string) {
    const appliaction = await this.PostService.updatePost(PostDto, id);
    return appliaction;
  }

  @Get('/')
  async getPost() {
    const appliaction = await this.PostService.findPost();
    return appliaction;
  }
}
