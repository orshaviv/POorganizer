import {Body, Controller, Post, Req, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe} from '@nestjs/common';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {AuthService} from "./auth.service";
import {UserPreferencesDto} from "../user-preferences/dto/user-preferences.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {UserLogoDto} from "../user-preferences/dto/user-logo.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'headerLogo', maxCount: 1 },
        { name: 'footerLogo', maxCount: 1 }
    ]))
    signUp(
        @UploadedFiles() files,
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
        @Body(ValidationPipe) userPreferencesDto: UserPreferencesDto
    ): Promise<void> {
        let userLogoDto = new UserLogoDto();
        userLogoDto.headerLogo = files.headerLogo[0];
        userLogoDto.footerLogo = files.footerLogo[0];

        return this.authService.signUp(userLogoDto, userPreferencesDto, authCredentialsDto);
    }

    @Post('signin')
    signIn(
        @Body() authCredentialsDto: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }
}
