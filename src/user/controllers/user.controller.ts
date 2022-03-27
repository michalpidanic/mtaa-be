import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundInterceptor } from 'src/common/interceptors/not-found.interceptor';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.userService.getUsers({ page, limit });
  }

  @UseInterceptors(new NotFoundInterceptor('User not found'))
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getUserById(@Req() req) {
    return this.userService.findUserById(req.params.id);
  }
}