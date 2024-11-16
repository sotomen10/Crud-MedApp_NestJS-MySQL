import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from './interfaces/user.interface';
import { User } from './entities/user.entity';
import { Role } from '../../auth/entities/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { FindById } from './dto/find-by-id.dto';

@Injectable()
export class UsersService implements UserInterface {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>
  ) {}

  async create(createUser: CreateUserDto): Promise<User> {
    try {
      const { password, confirmPassword, roles: roleIds } = createUser;
      const hashedPassword = await bcrypt.hash(password, 10);

      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords must match.');
      }

      const roles = await this.roleRepository.findBy({ id: In(roleIds) });
      if (roles.length !== roleIds.length) {
        throw new BadRequestException('One or more roles could not be found.');
      }

      const newUser = this.userRepository.create({
        ...createUser,
        password: hashedPassword,
        roles,
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Error in create user service:', error.message);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async findAll(pagination: PaginationDTO): Promise<{
    total: number;
    page: number;
    limit: number;
    users: User[];
  }> {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const [users, total] = await this.userRepository.findAndCount({
        skip,
        take: limit,
        relations: ['roles'],
      });

      return { total, page, limit, users };
    } catch (error) {
      console.error('Error in findAll users service:', error.message);
      throw new InternalServerErrorException('Failed to retrieve users.');
    }
  }

  async findOne(idObject: FindById): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: idObject.id },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${idObject.id} not found.`);
      }

      return user;
    } catch (error) {
      console.error('Error finding user:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching user data.');
    }
  }

  async update(idObject: FindById, updateUser: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: idObject.id },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${idObject.id} not found.`);
      }

      if (updateUser.password) {
        if (updateUser.password !== updateUser.confirmPassword) {
          throw new BadRequestException('Passwords must match.');
        }
        updateUser.password = await bcrypt.hash(updateUser.password, 10);
      }

      if (updateUser.roles) {
        const roles = await this.roleRepository.findBy({ id: In(updateUser.roles) });
        if (roles.length !== updateUser.roles.length) {
          throw new BadRequestException('One or more roles could not be found.');
        }
        user.roles = roles;
      }

      Object.assign(user, updateUser);

      await this.userRepository.save(user);

      return this.userRepository.findOne({
        where: { id: idObject.id },
        relations: ['roles'],
      });
    } catch (error) {
      console.error('Error updating user:', error.message);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user.');
    }
  }

  async remove(idObject: FindById): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: idObject.id },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${idObject.id} not found.`);
      }

      await this.userRepository.delete(idObject.id);

      return { message: `User with ID ${idObject.id} successfully deleted.` };
    } catch (error) {
      console.error('Error deleting user:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        relations: ['roles'],
      });
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw new InternalServerErrorException('Failed to retrieve user by email.');
    }
  }
}

