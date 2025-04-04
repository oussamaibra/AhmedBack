import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import {
  ResetUserAdminPasswordDto,
  ResetUserPasswordDto,
} from './dtos/ResetUserPasswordDto';
import { isEmpty, isNil, forEach } from 'lodash';
import * as moment from 'moment';
import * as _ from 'lodash';
import { SocketGateway } from 'src/socketIO/socket.gateway';
import { CreateUserDTO } from './dtos/create-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly SocketGateway: SocketGateway,
    private readonly jwtService: JwtService,
  ) {}

  async startWatching() {
    // this.userModel
    //   .watch<UserDocument>([], {
    //     fullDocument: 'updateLookup', // get full document after action
    //   })
    //   .on('change', (e: any) => {
    //     if (e.operationType === 'update') {
    //       if (Object.keys(e.updateDescription.updatedFields)[0] === 'isOnline')
    //         this.SocketGateway.sendFromServerToClient(
    //           {
    //             userId: e.fullDocument._id,
    //             isOnline: e.updateDescription.updatedFields.isOnline,
    //           },
    //           'isOnline',
    //         );
    //     }
    //   });
  }

  async addUser(createUserDTO: CreateUserDTO): Promise<any> {
    const email = createUserDTO?.email;

    const OldUser = await this.userModel.find({
      email: email,
    });

    const OldUserName = await this.userModel.find({
      username: createUserDTO?.username,
    });

    if (!OldUser[0] && !OldUserName[0]) {
      try {
        const newUser = await this.userModel.create(createUserDTO);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        newUser.save();
        const payload = {
          email: newUser.email,
          sub: newUser._id,
          type: newUser.type,
        };

        const access_token = this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
        });

        return {
          token: access_token,
          user: newUser,
        };
      } catch (err) {
        throw new HttpException(
          `Error: ${err.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        'Email or UserName already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUser(email: string): Promise<any | undefined> {
    const OldUser = await this.userModel.find({
      email: email,
    });

    if (!OldUser[0]) {
      throw new HttpException('Email Not Found ', HttpStatus.NOT_FOUND);
    } else {
      return OldUser[0];
    }
  }

  async updateUser(createUserDTO: CreateUserDTO, id: string): Promise<any> {
    try {
      const updatedRecompense = await this.userModel.findByIdAndUpdate(
        id,
        createUserDTO,
        {
          new: true,
        },
      );

      if (!updatedRecompense) {
        throw new HttpException('userModel not found ', HttpStatus.NOT_FOUND);
      }

      return updatedRecompense;
    } catch (error) {
      throw new Error(`Failed to update userModel: ${error.message}`);
    }
  }

  async findUserById(id: string): Promise<any | undefined> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('Not Data Found ', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }

  async findlistUsers(): Promise<any | undefined> {
    const user = await this.userModel.find();
    if (!user) {
      throw new HttpException('Not Data Found ', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }

  async deleteuser(id: string): Promise<User | undefined> {
    const user = await this.userModel.findOneAndDelete({ _id: id });
    if (!user) {
      throw new HttpException('User Not Found ', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }

  async ResetAdminUserPassword(
    restpassDto: ResetUserAdminPasswordDto,
  ): Promise<any> {
    const user = await this.userModel.findById(restpassDto.id);

    if (user) {
      const newpassword = await bcrypt.hash(restpassDto.Password, 10);
      await this.userModel.findByIdAndUpdate(restpassDto.id, {
        password: newpassword,
      });
      return user;
    } else {
      throw new HttpException('User not FOUND *', HttpStatus.NOT_FOUND);
    }
  }
}
