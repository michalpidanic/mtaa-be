import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundInterceptor } from 'src/common/interceptors/not-found.interceptor';
import { NotificationsDto } from '../dtos/user.dto';
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

  @UseGuards(AuthGuard('jwt'))
  @Post("notifications")
  changeNotificationSettings(@Body() notifications: NotificationsDto, @Req() req)
  {
    const userId = req.user.userId
    this.userService.changeNotificationSettings(notifications, userId)
  }
}
