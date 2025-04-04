// src/client/client.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './client.schema';
import { CreateClientDto } from './clientDTO';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const createdClient = new this.clientModel(createClientDto);
    return createdClient.save();
  }

  async findAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async findOne(id: string): Promise<Client> {
    return this.clientModel.findById(id).exec();
  }

  async update(id: string, updateClientDto: CreateClientDto): Promise<Client> {
    return this.clientModel
      .findByIdAndUpdate(id, updateClientDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Client> {
    return this.clientModel.findByIdAndDelete(id).exec();
  }

  async search(query: string): Promise<Client[]> {
    return this.clientModel
      .find({
        $or: [
          { nom: { $regex: query, $options: 'i' } },
          { telephone: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }
}
