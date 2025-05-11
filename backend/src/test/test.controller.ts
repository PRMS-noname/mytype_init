import { Controller, Post, Get, Body } from '@nestjs/common'
import { TestService } from './test.service'

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Post('users')
  async createTestUser(@Body() body: { username: string; email: string }) {
    return this.testService.createTestUser(body.username, body.email)
  }

  @Get('users')
  async getTestUsers() {
    return this.testService.getTestUsers()
  }
}
