import { IsString } from 'class-validator';

export class Auth42Dto {
  @IsString()
  code: string;

  @IsString()
  nickName?: string | null;
}
