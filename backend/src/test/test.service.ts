import { Injectable } from '@nestjs/common'
import { PrismaService } from '../config/prisma/prisma.service'

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async createTestUser(username: string, email: string) {
    try {
      const { data, error } = await this.prismaService.supabaseClient
        .from('test_users')
        .insert([
          {
            username,
            email,
          },
        ])
        .select()

      if (error) {
        throw new Error(`Failed to create test user: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error creating test user:', error)
      throw error
    }
  }

  async getTestUsers() {
    try {
      const { data, error } = await this.prismaService.supabaseClient
        .from('test_users')
        .select('*')

      if (error) {
        throw new Error(`Failed to get test users: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error getting test users:', error)
      throw error
    }
  }
}
