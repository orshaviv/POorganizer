import {EntityRepository, Repository} from "typeorm";
import {UserPreferences} from "./user-preferences.entity";
import {Logger} from "@nestjs/common";
import {UserPreferencesDto} from "./dto/user-preferences.dto";
import {User} from "../auth/user.entity";

@EntityRepository(UserPreferences)
export class UserPreferencesRepository extends Repository<UserPreferences> {
    private logger = new Logger('UserPreferencesRepository');

    async createUserPreferences(
        userPreferencesDto: UserPreferencesDto,
    ): Promise<UserPreferences> {
        const { companyName, companyCode, companyAddress, companyEmail, companyWebsite } = userPreferencesDto;
        const userPreferences = new UserPreferences();
        userPreferences.companyName = companyName;
        userPreferences.companyCode = companyCode;
        userPreferences.companyAddress = companyAddress;
        userPreferences.companyEmail = companyEmail;
        userPreferences.companyWebsite = companyWebsite;

        await userPreferences.save();

        return userPreferences;
    }

    async updateUserPreferences(
        userPreferencesDto: UserPreferencesDto,
        user: User
    ): Promise<UserPreferences> {
        const userPreferences = await user.userPreferences;
        const { companyName, companyCode, companyAddress, companyEmail, companyWebsite } = userPreferencesDto;

        if (companyName)
            userPreferences.companyName = companyName;
        if (companyCode)
            userPreferences.companyCode = companyCode;
        if (companyCode)
            userPreferences.companyAddress = companyAddress;
        if (companyCode)
            userPreferences.companyEmail = companyEmail;
        if (companyCode)
            userPreferences.companyWebsite = companyWebsite;

        await userPreferences.save();

        return userPreferences;
    }
}
