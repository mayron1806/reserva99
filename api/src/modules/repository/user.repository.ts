/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class UserRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async getByID(id: string): Promise<User> {
    const res = await this.txHost.tx.user.findUnique({
      where: { id },
    });
    return res as User;
  }

  async add(data: Prisma.UserCreateInput): Promise<User> {
    const res = await this.txHost.tx.user.create({ data });
    return res as User;
  }

  async update(id: string, data: User): Promise<User> {
    const res = await this.txHost.tx.user.update({
      where: { id },
      data,
    });
    return res as User;
  }
  async updateName(id: string, name: string): Promise<User> {
    const res = await this.txHost.tx.user.update({
      where: { id },
      data: {
        name,
      },
    });
    return res as User;
  }
  async delete(id: string): Promise<boolean> {
    const res = await this.txHost.tx.user.delete({ where: { id } });
    return !!res;
  }

  async getUserByNick(nick: string) {
    const res = await this.txHost.tx.user.findUnique({
      where: { nick }
    });
    return res as User;
  }
  async getUserByEmail(email: string) {
    const res = await this.txHost.tx.user.findUnique({
      where: { email },
    });
    return res as User;
  }
  async existsByNick(nick: string, ignoreId?: string) {
    const res = await this.txHost.tx.user.findUnique({
      where: { nick },
    });
    if (res?.id === ignoreId) {
      return false;
    }
    return !!res;
  }
  async existsByNameOrEmail(name: string, email: string): Promise<boolean> {
    const res = await this.txHost.tx.user.findFirst({
      where: {
        OR: [{ email }, { name }],
      },
    });
    return !!res;
  }
  async existsByEmail(email: string) {
    const res = await this.txHost.tx.user.findUnique({
      where: { email },
    });
    return !!res;
  }
}
