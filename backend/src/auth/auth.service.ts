import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

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

  async signIn42(code: string): Promise<any> {
    try {
      const token = this.http.post(
        `${this.authorizationURI}?grant_type=authorization_code&client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${code}&redirect_uri=${this.redirectURI}`,
      );

      this.accessToken = (await lastValueFrom(token)).data.access_token;
      this.headers = { Authorization: `Bearer ${this.accessToken}` };

     const response$ = this.http.get(`${this.endpoint}/me`, {
        headers: this.headers,
      });
      const { status, data } = await lastValueFrom(response$);

      console.log(`status: ${status}`);

      //return data;

      const user: User = this.usersRepository.create({
        username: data.login,
        firstName: data.first_name,
        lastName: data.last_name,
        profileImage: data.image_url,
        email: data.email,
      });

      console.log(user);

      this.usersRepository.createUser42(user);
      
    } catch (error) {
      console.log(error);
    }
  }
}
