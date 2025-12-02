import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateUserDto } from './dto/user.dto';
import { Role } from '../common/decorators/roles.decorator';
import { UserQueryDto } from './dto/user-query.dto';
import { calculatePagination, createPaginatedResponse } from '../common/utils/pagination.helper';

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
            role: Role.USER,
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
        role: Role.USER,
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

  async findAll(queryDto: UserQueryDto) {
    const { skip, take } = calculatePagination(queryDto);
    const page = queryDto.page ?? 1;
    const limit = queryDto.limit ?? 10;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      // 帳號搜尋（模糊搜尋，不區分大小寫）
      ...(queryDto.account && {
        account: {
          contains: queryDto.account,
          mode: 'insensitive',
        },
      }),
      // Email 搜尋（模糊搜尋，不區分大小寫）
      ...(queryDto.email && {
        email: {
          contains: queryDto.email,
          mode: 'insensitive',
        },
      }),
      // 電話搜尋（模糊搜尋）
      ...(queryDto.phone && {
        phone: {
          contains: queryDto.phone,
        },
      }),
      // 角色篩選
      ...(queryDto.role && { role: queryDto.role }),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        omit: { password: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return createPaginatedResponse(data, page, limit, total);
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
