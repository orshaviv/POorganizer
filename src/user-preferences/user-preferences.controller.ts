import {Body, Controller, Get, Logger, Patch, Post, UseGuards, ValidationPipe} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {UserPreferencesService} from "./user-preferences.service";
import {UserPreferencesDto} from "./dto/user-preferences.dto";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {UserPreferences} from "./user-preferences.entity";


@Controller('userpreferences')
@UseGuards(AuthGuard())
export class UserPreferencesController {
    private logger = new Logger('UserPreferences');

    constructor(
        private readonly userPreferencesService: UserPreferencesService,
    ) {}

    @Post('create')
    createUserPreferences(
        @Body(ValidationPipe) userPreferencesDto: UserPreferencesDto,
        @GetUser() user: User,
    ): Promise<UserPreferences> {
        return this.userPreferencesService.createUserPreferences(userPreferencesDto);
    }

    @Patch('update')
    updateUserPreferences(
        @Body(ValidationPipe) userPreferencesDto: UserPreferencesDto,
        @GetUser() user: User,
    ): Promise<UserPreferences> {
       return this.userPreferencesService.updateUserPreferences(userPreferencesDto, user);
    }
}
