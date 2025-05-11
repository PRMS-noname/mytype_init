import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient

  constructor(private configService: ConfigService) {
    const logOptions: Prisma.LogLevel[] =
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error']

    this.prisma = new PrismaClient({
      log: logOptions,
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    })
  }

  async onModuleInit() {
    try {
      await this.prisma.$connect()
      console.log('Successfully connected to PostgreSQL')
    } catch (error) {
      console.error('Failed to connect to PostgreSQL:', error)
      throw error
    }
  }

  async onModuleDestroy() {
    try {
      await this.prisma.$disconnect()
      console.log('Successfully disconnected from PostgreSQL')
    } catch (error) {
      console.error('Failed to disconnect from PostgreSQL:', error)
      throw error
    }
  }

  // Delegate all PrismaClient methods to the internal prisma instance
  get $connect() {
    return this.prisma.$connect.bind(this.prisma)
  }

  get $disconnect() {
    return this.prisma.$disconnect.bind(this.prisma)
  }
}
