import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findByAccount(account: string) {
    return this.prisma.user.findFirst({
      where: {
        account,
        deletedAt: null,
      },
    });
  }

  async create(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { account: registerDto.account },
    });

    if (existingUser) {
      if (existingUser.deletedAt) {
        return this.prisma.user.update({
          where: { account: registerDto.account },
          data: {
            ...registerDto,
            role: 'USER',
            deletedAt: null,
            updatedAt: new Date(),
          },
        });
      }

      throw new ConflictException('帳號已存在');
    }

    return this.prisma.user.create({
      data: {
        ...registerDto,
        role: 'USER',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException(`用戶不存在`);
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      omit: { password: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException(`用戶不存在`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: { password: true },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`用戶不存在`);
    }

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: '用戶已刪除' };
  }
}
