import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const logOptions: PrismaConfig['log'] =
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error']

    super({
      log: logOptions,
      errorFormat: 'pretty',
    })
  }

  async onModuleInit() {
    try {
      await this.$connect()
    } catch (error) {
      console.error('Failed to connect to PostgreSQL:', error)
      throw error
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect()
    } catch (error) {
      console.error('Failed to disconnect from PostgreSQL:', error)
      throw error
    }
  }
}
