import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  @ApiOperation({ summary: '註冊' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: '註冊成功',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: '帳號已存在' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '登入' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '登入成功',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: '帳號或密碼錯誤' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }
}
