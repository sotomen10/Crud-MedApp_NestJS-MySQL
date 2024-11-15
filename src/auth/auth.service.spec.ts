import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InternalServerErrorException, UnauthorizedException, HttpException } from '@nestjs/common';
import { login } from './dto/login-auth.dto';
import { User } from '../modules/users/entities/user.entity';
import { Role } from './entities/roles.entity';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should successfully sign in and return user and token', async () => {
      const user: User = {
        id: '1', 
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        phone: 1234567890,
        roles: [{ id: 1, name: 'User', users: [] } as Role], // Cambiado a número
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const loginDto: login = { email: 'john.doe@example.com', password: 'password' };

      // Mocking behavior
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await authService.signIn(loginDto);

      expect(result).toEqual({
        alldata: user,
        accessToken: 'token',
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(compare).toHaveBeenCalledWith(loginDto.password, user.password);
    });

    it('should throw HttpException if user not found', async () => {
      const loginDto: login = { email: 'non.existent@example.com', password: 'password' };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null); // Simulando usuario no encontrado

      await expect(authService.signIn(loginDto)).rejects.toThrow(HttpException);
      await expect(authService.signIn(loginDto)).rejects.toThrow('User with email non.existent@example.com not found');
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user: User = {
        id: '1', // UUID
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        phone: 1234567890,
        roles: [{ id: 1, name: 'User', users: [] } as Role], // Cambiado a número
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const loginDto: login = { email: 'john.doe@example.com', password: 'wrongPassword' };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(false); // Simulando contraseña incorrecta

      await expect(authService.signIn(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(authService.signIn(loginDto)).rejects.toThrow('Incorrect credentials');
    });

    it('should throw InternalServerErrorException for any other error', async () => {
      const loginDto: login = { email: 'john.doe@example.com', password: 'password' };

      jest.spyOn(usersService, 'findByEmail').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(authService.signIn(loginDto)).rejects.toThrow(InternalServerErrorException);
      await expect(authService.signIn(loginDto)).rejects.toThrow('An error occurred while signing in');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const newUser: User = {
        id: '1', // UUID
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        phone: 1234567890,
        roles: [{ id: 1, name: 'User', users: [] } as Role], // Cambiado a número
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
        confirmPassword: 'password',
        phone: 1234567890,
        roles: [1], // Asegúrate de que este valor es consistente con tu lógica
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(newUser);

      const result = await authService.register(createUserDto);

      expect(result).toEqual(newUser);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw InternalServerErrorException if registration fails', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
        confirmPassword: 'password',
        phone: 1234567890,
        roles: [1], // Asegúrate de que este valor es consistente con tu lógica
      };

      jest.spyOn(usersService, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(authService.register(createUserDto)).rejects.toThrow(InternalServerErrorException);
      await expect(authService.register(createUserDto)).rejects.toThrow('An error occurred while registering the user');
    });
  });

  // Si tienes más métodos que probar, puedes agregar más describe aquí
});