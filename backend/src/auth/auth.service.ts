import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../user/user.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Auth42Dto } from './dto/auth-42.dto';
@Injectable()
export class AuthService {
  private readonly clientSecret: string = process.env.CLIENT_SECRET;
  private readonly clientId: string = process.env.CLIENT_ID;
  private readonly endpoint: string = process.env.ENDPOINT;
  private readonly redirectURI: string = process.env.REDIRECT_URI;
  private readonly authorizationURI: string = process.env.AUTHORIZATION_URI;
  private accessToken: string;
  private headers: { Authorization: string };

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private http: HttpService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user: User = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async signIn42(auth42Dto: Auth42Dto): Promise<{ accessToken: string }> {
    try {
      const token = this.http.post(
        `${this.authorizationURI}?grant_type=authorization_code&client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${auth42Dto.code}&redirect_uri=${this.redirectURI}`,
      );

      this.accessToken = (await lastValueFrom(token)).data.access_token;
      this.headers = { Authorization: `Bearer ${this.accessToken}` };

      console.log(this.accessToken);
     const response$ = this.http.get(`${this.endpoint}/me`, {
        headers: this.headers,
      });
      const { status, data } = await lastValueFrom(response$);

      console.log(`status: ${status}`);

      console.log(auth42Dto.nickName);

      const authCredentialsDto: AuthCredentialsDto = {
        username: data.login,
        password: null,
        nickName: auth42Dto.nickName,
        firstName: data.first_name,
        lastName: data.last_name,
        profileImage: data.image_url,
        email: data.email,
      };

      const { username } = authCredentialsDto;
      let user: User = await this.usersRepository.findOne({ username });
  

      if (!user) {
        await this.usersRepository.createUser42(authCredentialsDto);
      }
      
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      user = await this.usersRepository.findOne({ username });
      user.isLogged = true;
      await this.usersRepository.save(user);
      return { accessToken: accessToken };

    } catch (error) {
      console.log(error);
    }
  }

  async logout(user: User): Promise<void> {

    user.isLogged = false;
    await this.usersRepository.save(user);
  }
}
