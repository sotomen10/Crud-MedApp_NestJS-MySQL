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
      let user: User = await this.usersService.findByEmail(emails[0].value);

      if (!user) {
        user = await this.usersService.create({
          fullName: `${name.givenName} ${name.familyName}`,
          email: emails[0].value,
          password: "123", // No password needed for Google authentication
          confirmPassword: "123",
          phone: 0,
          roles: [2], // Default role ID, ensure it's correct
        });
      }

      done(null, user);
    } catch (error) {
      done(new InternalServerErrorException('An error occurred during Google OAuth validation'), false);
    }
  }
}
