import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  list(): string {
    return 'list users';
  }

  @Get(':id')
  getById(@Param() params: any): string {
    return `get user by ${params.id}`;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(): string {
    return 'create user';
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteById(@Param() params: any): string {
    return `delete user by ${params.id}`;
  }
}
