import { LoggerService } from '@nestjs/common'

export const loggerConfig = (): LoggerService => ({
  log: (message: any, ...optionalParams: any[]) => {
    console.log(message, ...optionalParams)
  },
  error: (message: any, ...optionalParams: any[]) => {
    console.error(message, ...optionalParams)
  },
  warn: (message: any, ...optionalParams: any[]) => {
    console.warn(message, ...optionalParams)
  },
  debug: (message: any, ...optionalParams: any[]) => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(message, ...optionalParams)
    }
  },
  verbose: (message: any, ...optionalParams: any[]) => {
    if (process.env.LOG_LEVEL === 'verbose') {
      console.log(message, ...optionalParams)
    }
  },
})
