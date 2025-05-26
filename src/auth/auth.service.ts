import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

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

    const { password, ...result } = user.toObject();
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return {
      ...result,
      access_token: await this.jwtService.signAsync({
        sub: user._id,
        email: user.email,
      }),
    };
  }
}
