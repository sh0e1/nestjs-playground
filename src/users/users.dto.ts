import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}

@ApiExtraModels(User)
export class ListUsersResponse {
  @ApiProperty({
    type: 'array',
    items: {
      $ref: getSchemaPath(User),
    },
  })
  users: User[];
}

export class CreateUserRequest {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UpdateUserRequest {
  @ApiProperty()
  username: string;
}
