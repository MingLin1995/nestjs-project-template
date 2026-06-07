import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('API Check')
@Controller()
export class AppController {
  private readonly appVersion: string;

  constructor() {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    this.appVersion = packageJson.version;
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'API 連線測試' })
  getHealth() {
    return {
      status: 'ok',
      message: 'API 連線正常',
      timestamp: new Date().toISOString(),
      version: this.appVersion,
    };
  }
}
