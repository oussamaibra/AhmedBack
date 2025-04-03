import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { Posts, PostDocument } from './post.schema';
import * as moment from 'moment';
import { PostDTO } from './postDTO';
import { UserService } from 'src/user/user.service';
import { SocketGateway } from 'src/socketIO/socket.gateway';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Posts')
    private readonly PostModule: Model<PostDocument>,
  ) {}

  async addPost(PostDto: PostDTO): Promise<any> {
    const newPost = await this.PostModule.create({
      ...PostDto,
      creationDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
    });
    return newPost.save();
  }

  async findPost(): Promise<any[] | undefined> {
    const listPosts = await this.PostModule.find().populate({
      path: 'userId',
      model: 'User',
    });
    if (!listPosts) {
      throw new HttpException(
        'No Posts Done is Found for this User ',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return listPosts;
    }
  }

  async updatePost(postDto: PostDTO, id: string): Promise<any> {
    try {
      const updatedPost = await this.PostModule.findByIdAndUpdate(
        id,
        {
          ...postDto,
          lastupdatedate: moment().format('MMMM Do YYYY, h:mm:ss a'),
        },
        {
          new: true,
        },
      );

      if (!updatedPost) {
        throw new HttpException('Post not found ', HttpStatus.NOT_FOUND);
      }

      return updatedPost;
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }
  }
}
