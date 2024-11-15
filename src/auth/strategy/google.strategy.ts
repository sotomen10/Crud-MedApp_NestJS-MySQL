import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../../modules/users/users.service';
import { User } from '../../modules/users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.ID_GOOGLE_CLIENT,  
      clientSecret: process.env.SECRET_OF_CLIENT_GOOGLE,  
      callbackURL: process.env.GOOGLE_CALLBACK_URI || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],  
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;

    try {
      // Verifica si el usuario ya existe en la base de datos
      let user: User = await this.usersService.findByEmail(emails[0].value);

      // Si el usuario no existe, crea uno nuevo
      if (!user) {
        user = await this.usersService.create({
          fullName: `${name.givenName} ${name.familyName}`,
          email: emails[0].value,
          password: "123", // La autenticación de Google no usa contraseña
          confirmPassword: "123",
          phone: 0, // Puedes establecer esto en algo más significativo o cambiar la lógica
          roles: [2], // Asigna un rol por defecto. Asegúrate de que el ID "2" esté correcto
        });
      }

      // Retorna el usuario existente o recién creado
      done(null, user);
    } catch (error) {
      // Maneja cualquier error que ocurra durante la validación o la creación del usuario
      done(new InternalServerErrorException('An error occurred during Google OAuth validation'), false);
    }
  }
}

