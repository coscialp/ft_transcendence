import { IsString } from 'class-validator';

export class Auth42Dto {
  @IsString()
  code: string;
  
  nickName?: string | null;

  admin: boolean = false;
}
