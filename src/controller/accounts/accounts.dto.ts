import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';
import { passwordRegex } from 'src/domain/account/account.type';

export class CreateAccountRequest {
  @ApiProperty()
  @IsString()
  @Length(5, 191)
  name: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(191)
  email: string;

  @ApiProperty()
  @Matches(passwordRegex)
  password: string;
}

export class CreateAccountResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
