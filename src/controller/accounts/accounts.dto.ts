import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';
import { passwordRegex } from 'src/domain/account/account.type';

class AccountDto {
  @ApiProperty()
  id: number;

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

export class CreateAccountRequest extends OmitType(AccountDto, [
  'id',
] as const) {}

export class CreateAccountResponse extends OmitType(AccountDto, [
  'password',
] as const) {}
