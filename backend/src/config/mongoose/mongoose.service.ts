import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import mongoose from "mongoose";

@Injectable()
export class MongooseService implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const uri = this.configService.get<string>("MONGODB_URI");
      if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
      }

      await mongoose.connect(uri);
      console.log("Successfully connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await mongoose.disconnect();
      console.log("Successfully disconnected from MongoDB");
    } catch (error) {
      console.error("Failed to disconnect from MongoDB:", error);
      throw error;
    }
  }
}
