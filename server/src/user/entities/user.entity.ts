/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ default: null })
  uid: string;

  @IsEmail()
  @Prop({ default: null })
  email: string;

  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop({ default: null })
  profile: string;


  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
