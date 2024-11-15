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
    @InjectRepository(User) private userRepositori: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role> // Repositorio de roles
  ) {}

  async create(createUser: CreateUserDto): Promise<User> {
    try {
      const { password, confirmPassword, roles: roleIds } = createUser;
      const encryptedPassword = await bcrypt.hash(password, 10);

      if (password === confirmPassword) {
        
        const roles = await this.roleRepository.findBy({ id: In(roleIds) });
        if (roles.length !== roleIds.length) {
          throw new BadRequestException('Some roles were not found.');
        }

        
        const user = this.userRepositori.create({
          ...createUser,
          password: encryptedPassword,
          roles,  
        });

        const usersaved = await this.userRepositori.save(user);
        return usersaved;
      } else {
        throw new BadRequestException('Ensure that confirm password and password is the same');
      }
    } catch (error) {
      console.log('Error from service of create user:', error.message);
      throw new InternalServerErrorException('Error creating the user from service');
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
      const [users, total] = await this.userRepositori.findAndCount({
        skip,
        take: limit,
        relations: ['roles'],  
      });
      return {
        total,
        page,
        limit,
        users,
      };
    } catch (error) {
      console.log('Error from service of findAll users:', error.message);
    }
  }

  async findOne(idObject: FindById): Promise<User> {
    try {
  
      const userFinded = await this.userRepositori.findOne({
        where: { id: idObject.id },
        relations: ['roles'],  
      });
      if (!userFinded) {
        throw new NotFoundException(`User with id ${idObject.id} was not found, ensure that the id is correct`);
      }
      return userFinded;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding user:', error.message);
      throw new InternalServerErrorException('Error finding the user. Please try again later.');
    }
  }

  async update(idObject: FindById, updateUser: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepositori.findOne({ where: { id: idObject.id }, relations: ['roles'] });
      if (!user) {
        throw new NotFoundException(`User with id ${idObject.id} was not found.`);
      }

      if (updateUser.password) {
        const { password, confirmPassword } = updateUser;

        if (password !== confirmPassword) {
          throw new BadRequestException('Password and confirm password do not match.');
        }

        updateUser.password = await bcrypt.hash(password, 10);
      }

      
      if (updateUser.roles) {
        const roles = await this.roleRepository.findBy({ id: In(updateUser.roles) });
        if (roles.length !== updateUser.roles.length) {
          throw new BadRequestException('Some roles were not found.');
        }
        user.roles = roles;
      }

      await this.userRepositori.save(user); 

      const updatedUser = await this.userRepositori.findOne({
        where: { id: idObject.id },
        relations: ['roles'],
      });
      if (!updatedUser) {
        throw new InternalServerErrorException('Failed to retrieve updated user.');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error.message);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating the user. Please try again later.');
    }
  }

  async remove(idObject: FindById): Promise<{ message: string }> {
    try {
      const user = await this.userRepositori.findOne({ where: { id: idObject.id }, relations: ['roles'] });
      if (!user) {
        throw new NotFoundException(`User with id ${idObject.id} was not found.`);
      }

      await this.userRepositori.delete(idObject);

      return { message: `User with id ${idObject.id} was successfully deleted.` };
    } catch (error) {
      console.error('Error deleting user:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting the user. Please try again later.');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepositori.findOne({
        where: { email },
        relations: ['roles']
      });
      
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw new InternalServerErrorException('Error finding the user by email. Please try again later.');
    }
  }

}
