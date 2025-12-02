import { Controller, Get, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto, PaginatedUserResponseDto } from './dto/user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { RequestUser } from '../auth/interfaces/auth.interface';

interface RequestWithUser {
  user: RequestUser;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '取得當前用戶資訊' })
  @ApiResponse({
    status: 200,
    description: '取得當前用戶資訊成功',
    type: UserResponseDto,
  })
  getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOne(req.user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: '更新當前用戶資訊' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: '更新當前用戶資訊成功',
    type: UserResponseDto,
  })
  updateProfile(@Request() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '取得所有用戶列表（ADMIN）',
    description: '支援分頁和搜尋功能。可依帳號、Email、電話、角色進行篩選。',
  })
  @ApiResponse({
    status: 200,
    description: '取得所有用戶列表成功',
    type: PaginatedUserResponseDto,
  })
  @ApiResponse({ status: 403, description: '無權限執行此操作' })
  findAll(@Query() queryDto: UserQueryDto) {
    return this.usersService.findAll(queryDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '取得特定用戶資訊（ADMIN）' })
  @ApiResponse({
    status: 200,
    description: '取得特定用戶資訊成功',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: '用戶不存在' })
  @ApiResponse({ status: 403, description: '無權限執行此操作' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '更新特定用戶資訊（ADMIN）' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: '更新特定用戶資訊成功',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: '用戶不存在' })
  @ApiResponse({ status: 403, description: '無權限執行此操作' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '刪除用戶（ADMIN）' })
  @ApiResponse({ status: 200, description: '刪除用戶成功' })
  @ApiResponse({ status: 404, description: '用戶不存在' })
  @ApiResponse({ status: 403, description: '無權限執行此操作' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
