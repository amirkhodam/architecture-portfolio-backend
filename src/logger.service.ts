import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const LOG_ROOT = path.resolve(__dirname, '../../logs');
const LOG_TYPES = ['log', 'error', 'warn', 'debug', 'verbose'];

@Injectable()
export class LoggerService implements NestLoggerService {
  private ensureLogDir(type: string) {
    const dir = path.join(LOG_ROOT, type);
    if (!fs.existsSync(LOG_ROOT)) {
      fs.mkdirSync(LOG_ROOT);
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return dir;
  }

  private writeLog(type: string, message: string, ...optionalParams: any[]) {
    const dir = this.ensureLogDir(type);
    const date = new Date();
    const fileName = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
    const filePath = path.join(dir, fileName);
    const timestamp = date.toISOString();
    const logLine = `[${timestamp}] [${type.toUpperCase()}] ${message} ${optionalParams.map(p => JSON.stringify(p)).join(' ')}\n`;
    fs.appendFileSync(filePath, logLine, { encoding: 'utf8' });
  }

  log(message: string, ...optionalParams: any[]) {
    console.log(`[LOG]`, message, ...optionalParams);
    this.writeLog('log', message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    console.error(`[ERROR]`, message, ...optionalParams);
    this.writeLog('error', message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN]`, message, ...optionalParams);
    this.writeLog('warn', message, ...optionalParams);
  }

  debug?(message: string, ...optionalParams: any[]) {
    console.debug(`[DEBUG]`, message, ...optionalParams);
    this.writeLog('debug', message, ...optionalParams);
  }

  verbose?(message: string, ...optionalParams: any[]) {
    console.info(`[VERBOSE]`, message, ...optionalParams);
    this.writeLog('verbose', message, ...optionalParams);
  }
} 