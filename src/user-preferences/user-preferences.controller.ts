import {
    Body,
    Controller, Get,
    Logger,
    Patch,
    UploadedFiles,
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
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {UserLogoDto} from "./dto/user-logo.dto";
import {userImageFileFilter} from "./user-image-file-filter";

@Controller('userpreferences')
@UseGuards(AuthGuard())
export class UserPreferencesController {
    private logger = new Logger('UserPreferences');

    constructor(
        private readonly userPreferencesService: UserPreferencesService,
    ) {}

    @Get()
    getUserPreferences(
        @GetUser() user: User
    ): Promise<UserPreferences> {
        return this.userPreferencesService.getUserPreferences(user);
    }

    @Patch('update')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'headerLogo', maxCount: 1 },
        { name: 'footerLogo', maxCount: 1 }
    ],{ fileFilter: userImageFileFilter }))
    updateUserPreferences(
        @UploadedFiles() userLogoDto: UserLogoDto,
        @Body(ValidationPipe) userPreferencesDto: UserPreferencesDto,
        @GetUser() user: User,
    ): Promise<UserPreferences> {
        // this.logger.verbose('updating user data');
        UserLogoDto.validateData(userLogoDto);
        return this.userPreferencesService.updateUserPreferences(userPreferencesDto, userLogoDto, user);
    }
}
