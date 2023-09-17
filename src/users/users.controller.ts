import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserRequest,
  ListUsersResponse,
  UpdateUserRequest,
  User,
} from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: ListUsersResponse })
  async list(): Promise<ListUsersResponse> {
    const users = await this.usersService.findAll();
    return {
      users: users.map((u) => {
        return { id: u.id, username: u.username, email: u.email };
      }),
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  async getById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(parseInt(id));
    if (!user) throw new NotFoundException('user not found');
    return { id: user.id, username: user.username, email: user.email };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: User })
  async create(@Body() body: CreateUserRequest): Promise<User> {
    const user = await this.usersService.create(body);
    return { id: user.id, username: user.username, email: user.email };
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserRequest,
  ): Promise<User> {
    const user = await this.usersService.update(parseInt(id), body);
    return { id: user.id, username: user.username, email: user.email };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.usersService.deleteById(parseInt(id));
  }
}
