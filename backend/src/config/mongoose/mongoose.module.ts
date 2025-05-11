import { Global, Module } from "@nestjs/common";
import { MongooseService } from "./mongoose.service";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  providers: [
    {
      provide: MongooseService,
      useFactory: (configService: ConfigService) => {
        return new MongooseService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [MongooseService],
})
export class MongooseConfigModule {}
