import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {JwtService} from "@nestjs/jwt";
import {UserPreferencesService} from "../user-preferences/user-preferences.service";
import {UserPreferencesDto} from "../user-preferences/dto/user-preferences.dto";

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,

        private readonly userPreferencesService: UserPreferencesService
    ) {}

    async signUp(
        userPreferencesDto: UserPreferencesDto,
        authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        const userPreferences = await this.userPreferencesService.createUserPreferences(userPreferencesDto);

        return await this.userRepository.signUp(userPreferences, authCredentialsDto);
    }

    async signIn(
        authCredentialsDto: AuthCredentialsDto
    ): Promise<{
        accessToken: string
    }> {
        const user = await this.userRepository.validateUserPassword(authCredentialsDto);

        if(!user){
            throw new UnauthorizedException('Invalid credentials.');
        }

        const {username, email, firstName, lastName} = user;

        const payload = { username, email, firstName, lastName };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT with payload ${JSON.stringify(payload)}`);

        return { accessToken };
    }
}
