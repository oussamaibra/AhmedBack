import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostDTO } from './postDTO';

export type PostDocument = PostDTO & Document;

@Schema()
export class Posts {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recompense',
  })
  etabId: string;

  @Prop({ type: String })
  posteDate: string;
  @Prop({ type: String })
  creationDate: string;
  @Prop({ type: String })
  lastupdatedate: string;
  @Prop({ type: String })
  validationDate: string;
  @Prop({ type: String })
  username: string;
  @Prop({ type: String })
  mediaUrl: string;
  @Prop({ type: String })
  hashtags: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  url: string;
  @Prop({ type: String })
  status: string;
  @Prop({ type: String })
  type: string;
  @Prop({ type: String })
  likes: string;
  @Prop({ type: String })
  comments: string;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
