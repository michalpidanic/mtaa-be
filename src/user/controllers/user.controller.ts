import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NotFoundInterceptor } from 'src/common/interceptors/not-found.interceptor';
import {
  NotificationsDto,
  PaginatedUserResponseDto,
  UserResponseDto,
} from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: PaginatedUserResponseDto })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.userService.getUsers({ page, limit });
  }

  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: UserResponseDto })
  @UseInterceptors(new NotFoundInterceptor('User not found'))
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getUserById(@Req() req) {
    return this.userService.findUserById(req.params.id);
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @UseGuards(AuthGuard('jwt'))
  @Patch('notifications')
  changeNotificationSettings(
    @Body() notifications: NotificationsDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.userService.changeNotificationSettings(notifications, userId);
  }
}
