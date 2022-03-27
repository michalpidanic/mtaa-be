import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginCredentialsDto, RegistrationDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: RegistrationDto) {
    return this.authService.register(user);
  }

  @HttpCode(200)
  @Post('login')
  login(@Body() credentials: LoginCredentialsDto) {
    return this.authService.login(credentials);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Req() req) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const refreshToken = req.body.refreshToken;

    return this.authService.logout(accessToken, refreshToken);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(200)
  @Post('refresh-token')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.body.refreshToken);
  }
}
