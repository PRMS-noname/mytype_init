import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ConfigService } from '@nestjs/config'

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: (configService: ConfigService) => {
        const prisma = new PrismaService(configService)
        return prisma
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService],
})
export class PrismaConfigModule {}
