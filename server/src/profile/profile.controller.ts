import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { UserService } from 'src/user/user.service';

@Controller('v1/profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private userService: UserService,
  ) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    const requiredFields = ['id', 'email', 'userName'];
    const missingFields = requiredFields.filter(
      (field) => !createProfileDto[field],
    );
    if (missingFields.length > 0) {
      throw new HttpException(
        `Missing required fields: ${missingFields.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const isExist = await this.profileService.findOne(createProfileDto.id);
      if (isExist) {
        throw new HttpException(
          'Profile already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newProfile = await this.profileService.create(createProfileDto);
      if (!newProfile) {
        try {
          console.log('No profile');
          await this.userService.remove(createProfileDto.id);
        } catch (error) {
          throw new Error(error);
        }
      } else {
        console.log('Have profile');
        this.userService.update(newProfile.id, {
          profile: newProfile.id,
        });
      }
      return newProfile;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const profile = await this.profileService.findOne(id);
      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const profiles = await this.profileService.findAll();
      return profiles;
    } catch (error) {
      throw error;
    }
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const updatedProfile = await this.profileService.update(
        id,
        updateProfileDto,
      );
      if (!updatedProfile) {
        throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
      }
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedProfile = await this.profileService.remove(id);
      if (!deletedProfile) {
        throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
      }
      return deletedProfile;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/courses')
  async getAllCourseOfProfile(@Param('id') id: string) {
    try {
      const profile = await this.profileService.getAllCourseOfProfile(id);
      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
}
