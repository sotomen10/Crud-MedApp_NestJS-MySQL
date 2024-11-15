import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { login } from './dto/login-auth.dto';


const mockAuthService = {
  register: jest.fn(),
  generateJwtToken: jest.fn(),
  signIn: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        phone: 1234567890,
        roles: [],
      };

      mockAuthService.register.mockResolvedValue(createUserDto);

      const result = await authController.register(createUserDto);
      expect(result).toEqual(createUserDto);
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('signIn', () => {
    it('should sign in an existing user', async () => {
      const loginData: login = {
        email: 'test@example.com',
        password: 'password',
      };

      const user: User = {
        id: 'uuid-1234',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        phone: 1234567890,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [],
      };

      const accessToken = 'jwt.token';

      mockAuthService.signIn.mockResolvedValue({ alldata: user, accessToken });

      const result = await authController.signIn(loginData);
      expect(result).toEqual({ alldata: user, accessToken });
      expect(mockAuthService.signIn).toHaveBeenCalledWith(loginData);
    });
  });

  describe('googleAuthCallback', () => {
    it('should redirect with access token', async () => {
      const req = {
        user: {
          id: 'uuid-1234',
          email: 'test@example.com',
          roles: [{ id: 1, name: 'user' }],
        },
      };

      const res = {
        redirect: jest.fn(),
      };

      const accessToken = 'jwt.token';
      mockAuthService.generateJwtToken.mockResolvedValue(accessToken);

      await authController.googleAuthCallback(req, res);

      expect(mockAuthService.generateJwtToken).toHaveBeenCalledWith({
        id: req.user.id,
        email: req.user.email,
        roles: req.user.roles,
      });
      expect(res.redirect).toHaveBeenCalledWith(`http://localhost:3001/?token=${accessToken}`);
    });
  });
});