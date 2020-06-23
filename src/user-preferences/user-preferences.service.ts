import {Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserPreferencesRepository} from "./user-preferences.repository";
import {User} from "../auth/user.entity";
import {UserPreferences} from "./user-preferences.entity";
import {UserPreferencesDto} from "./dto/user-preferences.dto";
import {UserLogoDto} from "./dto/user-logo.dto";

@Injectable()
export class UserPreferencesService {
    private logger = new Logger('UserPreferencesService');

    constructor(
        @InjectRepository(UserPreferencesRepository)
        private userPreferencesRepo: UserPreferencesRepository,
    ) {}

    createUserPreferences(
        userPreferencesDto: UserPreferencesDto,
        userLogoDto: UserLogoDto,
    ): Promise<UserPreferences> {
        return this.userPreferencesRepo.createUserPreferences(userPreferencesDto, userLogoDto);
    }

    updateUserPreferences(
        userPreferencesDto: UserPreferencesDto,
        userLogoDto: UserLogoDto,
        user: User
    ): Promise<UserPreferences> {
        return this.userPreferencesRepo.updateUserPreferences(userPreferencesDto, userLogoDto, user);
    }

}
