import {Body, Controller, Post, Req, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe} from '@nestjs/common';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {AuthService} from "./auth.service";
import {UserPreferencesDto} from "../user-preferences/dto/user-preferences.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {UserLogoDto} from "../user-preferences/dto/user-logo.dto";
import {userImageFileFilter} from "../user-preferences/user-image-file-filter";

const whiteSquareBase64Url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'headerLogo', maxCount: 1 },
        { name: 'footerLogo', maxCount: 1 }
    ],{ fileFilter: userImageFileFilter }))
    signUp(
        @UploadedFiles() userLogoDto: UserLogoDto,
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
        @Body(ValidationPipe) userPreferencesDto: UserPreferencesDto
    ): Promise<void> {
        userLogoDto = UserLogoDto.validateData(userLogoDto);
        return this.authService.signUp(userLogoDto, userPreferencesDto, authCredentialsDto);
    }

    @Post('signin')
    signIn(
        @Body() authCredentialsDto: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }
}
