import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const {username, email, firstName, lastName} = await this.userRepository.validateUserPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const payload = { username, email, firstName, lastName };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
