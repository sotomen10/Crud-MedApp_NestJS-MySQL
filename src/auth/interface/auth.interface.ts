import { login } from "../dto/login-auth.dto";
import { User } from "src/modules/users/entities/user.entity";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";


export interface AuthInterface {
    signIn(data:login):Promise<{alldata:User,
        accessToken:string
      }>
     register(data:CreateUserDto):Promise<User>
}