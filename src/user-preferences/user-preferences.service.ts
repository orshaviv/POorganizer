import {Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserPreferencesRepository} from "./user-preferences.repository";
import {User} from "../auth/user.entity";
import {UserPreferences} from "./user-preferences.entity";
import {UserPreferencesDto} from "./dto/user-preferences.dto";

@Injectable()
export class UserPreferencesService {
    private logger = new Logger('UserPreferencesService');

    constructor(
        @InjectRepository(UserPreferencesRepository)
        private userPreferencesRepo: UserPreferencesRepository,
    ) {}

    createUserPreferences(
        userPreferencesDto: UserPreferencesDto,
    ): Promise<UserPreferences> {
        return this.userPreferencesRepo.createUserPreferences(userPreferencesDto);
    }

    updateUserPreferences(
        userPreferencesDto: UserPreferencesDto,
        user: User
    ): Promise<UserPreferences> {
        return this.userPreferencesRepo.updateUserPreferences(userPreferencesDto, user);
    }
}
