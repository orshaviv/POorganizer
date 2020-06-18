import {Body, Controller, Post, Req, UseGuards, ValidationPipe} from '@nestjs/common';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {AuthService} from "./auth.service";
import {UserPreferencesDto} from "../user-preferences/dto/user-preferences.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
        @Body(ValidationPipe) userPreferencesDto: UserPreferencesDto
    ): Promise<void> {
        return this.authService.signUp(userPreferencesDto, authCredentialsDto);
    }

    @Post('signin')
    signIn(
        @Body() authCredentialsDto: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }
}
