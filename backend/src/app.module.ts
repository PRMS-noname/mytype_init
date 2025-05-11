import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaConfigModule } from './config/prisma/prisma.module'
import { MongooseConfigModule } from './config/mongoose/mongoose.module'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'
import { TestModule } from './test/test.module'

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
}

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    PrismaConfigModule,
    MongooseConfigModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
