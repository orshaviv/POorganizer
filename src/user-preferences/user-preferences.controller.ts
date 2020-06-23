import {
    Body,
    Controller,
    Get,
    Logger,
    Patch,
    Post, Res,
    UploadedFile, UploadedFiles,
    UseGuards,
    UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {UserPreferencesService} from "./user-preferences.service";
import {UserPreferencesDto} from "./dto/user-preferences.dto";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {UserPreferences} from "./user-preferences.entity";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {UserLogoDto} from "./dto/user-logo.dto";


@Controller('userpreferences')
@UseGuards(AuthGuard())
export class UserPreferencesController {
    private logger = new Logger('UserPreferences');

    constructor(
        private readonly userPreferencesService: UserPreferencesService,
    ) {}

    @Post('create')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'headerLogo', maxCount: 1 },
        { name: 'footerLogo', maxCount: 1 }
    ]))
    createUserPreferences(
        @UploadedFiles() files,
        @Body(ValidationPipe) userPreferencesDto: UserPreferencesDto,
        @GetUser() user: User,
    ): Promise<UserPreferences> {
        let userLogoDto = new UserLogoDto();
        userLogoDto.headerLogo = files.headerLogo;
        userLogoDto.footerLogo = files.footerLogo;

        return this.userPreferencesService.createUserPreferences(userPreferencesDto, userLogoDto);
    }

    @Patch('update')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'headerLogo', maxCount: 1 },
        { name: 'footerLogo', maxCount: 1 }
    ]))
    updateUserPreferences(
        @UploadedFiles() files,
        @Body(ValidationPipe) userPreferencesDto: UserPreferencesDto,
        @GetUser() user: User,
    ): Promise<UserPreferences> {
        let userLogoDto = new UserLogoDto();
        userLogoDto.headerLogo = files.headerLogo[0];
        userLogoDto.footerLogo = files.footerLogo[0];

        return this.userPreferencesService.updateUserPreferences(userPreferencesDto, userLogoDto, user);
    }
}
