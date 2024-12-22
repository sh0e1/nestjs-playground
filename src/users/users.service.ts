import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({});
  }

  async findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(user: Prisma.UserCreateInput): Promise<User> {
    user.password = bcrypt.hashSync(user.password, 10);
    return this.prisma.user.create({ data: user });
  }

  async update(id: number, user: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ data: user, where: { id } });
  }

  async deleteById(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
