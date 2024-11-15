import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger'; // Importa los decoradores de Swagger
import { AuthService } from './auth.service';
import { login } from './dto/login-auth.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { CreateUserPipe } from 'src/modules/users/pipes/create-user.pipe';
import { GoogleAuthGuard } from './guards/jwt-google.guard';
import { LoginCountInterceptor } from './interceptor/interceptor-count-login.interceptor';

@ApiTags('auth') // Añade una etiqueta para agrupar las rutas en Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiOperation({ summary: 'Inicia el flujo de autenticación con Google' })
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // No se necesita lógica aquí ya que es manejado por el guard
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Callback de autenticación con Google' })
  @ApiResponse({ status: 302, description: 'Redirige al frontend con el token de acceso' })
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res) {
    const user = req.user;
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(role => ({
        id: role.id,
        name: role.name,
      })),
    };
    const accessToken = await this.authService.generateJwtToken(payload);
    res.redirect(`http://localhost:3001/?token=${accessToken}`);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @ApiBody({ type: CreateUserDto }) // Documenta el body que se espera en el request
  register(@Body(CreateUserPipe) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('signin')
  @UseInterceptors(LoginCountInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión iniciada correctamente' })
  @ApiBody({ type: login }) // Documenta el DTO que se espera en el body del request
  async signIn(@Body() login: login): Promise<{ alldata: User; accessToken: string }> {
    return this.authService.signIn(login);
  }
}
