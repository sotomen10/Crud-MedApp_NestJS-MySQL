import { HttpException, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { login } from './dto/login-auth.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthInterface } from './interface/auth.interface';
import { UsersService } from 'src/modules/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: login): Promise<{ alldata: User; accessToken: string }> {
    try {
      const user = await this.userService.findByEmail(data.email);
      if (!user) {
        throw new HttpException(`User with email ${data.email} not found`, 404);
      }

      const isPasswordValid = await compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect credentials');
      }

      const fullUser = await this.userService.findOne({ id: user.id });

      const payload = {
        id: fullUser.id,
        email: fullUser.email,
        roles: fullUser.roles.map(role => ({
          id: role.id,
          name: role.name,
        })),
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        alldata: fullUser,
        accessToken,
      };
    } catch (error) {
      if (error instanceof HttpException || error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An error occurred while signing in');
      }
    }
  }

  async register(data: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(data);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }

  async generateJwtToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async googleAuthUser(email: string, fullName: string, roles: number[]): Promise<{ alldata: User; accessToken: string }> {
    try {
      // Verifica si el usuario ya existe
      let user = await this.userService.findByEmail(email);

      // Si no existe, crea un nuevo usuario
      if (!user) {
        user = await this.userService.create({
          fullName,
          email,
          password: null,  // No se requiere contraseña para Google
          confirmPassword: null,
          phone: 0, // Puedes establecer esto en algo más significativo o cambiar la lógica
          roles,
        });
      }

      // Genera el payload y el token JWT
      const payload = {
        id: user.id,
        email: user.email,
        roles: user.roles.map(role => ({
          id: role.id,
          name: role.name,
        })),
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        alldata: user,
        accessToken,
      };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred during Google authentication');
    }
  }
}
