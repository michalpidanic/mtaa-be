import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UnauthorizedInterceptor } from 'src/common/interceptors/unauthorized.interceptor';
import { UserResponseDto } from 'src/user/dtos/user.dto';
import {
  LoginCredentialsDto,
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  RegistrationDto,
} from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: UserResponseDto })
  @Post('register')
  register(@Body() user: RegistrationDto) {
    return this.authService.register(user);
  }

  @ApiOkResponse({ type: LoginResponseDto })
  @Post('login')
  @UseInterceptors(new UnauthorizedInterceptor('Invalid credentials'))
  login(@Body() credentials: LoginCredentialsDto) {
    return this.authService.login(credentials);
  }

  @ApiOkResponse()
  @Post('logout')
  @HttpCode(200)
  logout(@Req() req, @Body() body: RefreshTokenDto) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    return this.authService.logout(accessToken, body.refreshToken);
  }

  @ApiOkResponse({ type: RefreshTokenResponseDto })
  @ApiUnauthorizedResponse()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  refreshToken(@Req() req, @Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
