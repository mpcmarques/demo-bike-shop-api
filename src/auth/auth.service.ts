import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!user || !(await user.isValidPassword(pass))) {
      throw new UnauthorizedException();
    }

    // TODO: Generate a JWT and return it here
    // instead of the user object

    return {
      access_token: await this.jwtService.signAsync({
        sub: user._id,
        email: user.email,
      }),
    };
  }

  async getProfile(email: string): Promise<User | null | undefined> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user.toObject();

    return result;
  }
}
