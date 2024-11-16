import { Controller, Get, Post, Body, Query, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { NotificationsGateway } from '../../notifications/notifications.gateway'; // Importamos el Gateway
import { ApiTags, ApiBearerAuth, ApiQuery, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FindById } from './dto/find-by-id.dto';

@ApiTags('Users')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)  // Descomenta esto si deseas usar autenticación con JWT
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsGateway: NotificationsGateway,
  ) { }

  @Get()
  @ApiResponse({ status: 200, description: 'List of users', type: [CreateUserDto] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit of users per page' })
  async findAll(@Query() pagination: PaginationDTO) {
    const usersData = await this.usersService.findAll(pagination);
    const users = usersData.users;

    // Notificación cuando se obtienen usuarios
    this.notificationsGateway.notifyAll('notification', {
      action: 'findAllUsers',
      message: `Fetched ${users.length} users`, 
      data: users
    });

    return usersData;
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User found', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  async findOne(@Param('id') id: FindById) {
    const user = await this.usersService.findOne(id);
    
    // Notificación cuando se obtiene un usuario específico
    this.notificationsGateway.notifyAll('notification', {
      action: 'findOne',
      message: `Fetched user with ID: ${id}`,
      data: user
    });

    return user;
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: FindById, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    
    // Notificación cuando un usuario es actualizado
    this.notificationsGateway.notifyAll('notification', {
      action: 'update',
      message: `User with ID: ${id} updated`,
      data: updatedUser
    });

    return updatedUser;
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User removed' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  async remove(@Param('id') id: FindById) {
    const result = await this.usersService.remove(id);
    
    // Notificación cuando un usuario es eliminado
    this.notificationsGateway.notifyAll('notification', {
      action: 'remove',
      message: `User with ID: ${id} removed`,
      data: { id }
    });

    return result;
  }
}
