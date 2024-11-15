import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../modules/users/users.service"; 
import { User } from "../../modules/users/entities/user.entity"; 

@Injectable()
export class JwtStrategyRols extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_APPI,
        });
    }

    async validate(payload: any): Promise<any> {
      console.log('Payload:', payload); 
      const user: User = await this.usersService.findOne({ id: payload.id });
  
      if (!user) {
          throw new UnauthorizedException('User not found');
      }
  
      const userWithRoles = {
          id: user.id,
          email: user.email,
          roles: user.roles.map(role => ({
              id: role.id,
              name: role.name
          })),
      };
  
      console.log('User in validate:', userWithRoles); 
  
      return userWithRoles; 
  }
}