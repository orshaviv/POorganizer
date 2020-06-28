import {EntityRepository, Repository} from "typeorm";
import {UserPreferences} from "./user-preferences.entity";
import {Logger} from "@nestjs/common";
import {UserPreferencesDto} from "./dto/user-preferences.dto";
import {User} from "../auth/user.entity";
import {UserLogoDto} from "./dto/user-logo.dto";

@EntityRepository(UserPreferences)
export class UserPreferencesRepository extends Repository<UserPreferences> {
    private logger = new Logger('UserPreferencesRepository');

    /*
    async createUserPreferences(
        userPreferencesDto: UserPreferencesDto,
        userLogoDto: UserLogoDto,
    ): Promise<UserPreferences> {
        const { companyName, companyCode, companyAddress, companyEmail, companyWebsite } = userPreferencesDto;

        const userPreferences = new UserPreferences();
        userPreferences.companyName = companyName;
        userPreferences.companyCode = companyCode;
        userPreferences.companyAddress = companyAddress;
        userPreferences.companyEmail = companyEmail;
        userPreferences.companyWebsite = companyWebsite;

        const { headerLogo, footerLogo } = userLogoDto;
        if (headerLogo)
            userPreferences.headerLogo = this.convertFileToBase64(headerLogo);
        if (footerLogo)
            userPreferences.headerLogo = this.convertFileToBase64(footerLogo);

        await userPreferences.save();

        return userPreferences;
    }
    */

    async createOrUpdateUserPreferences(
        userPreferencesDto: UserPreferencesDto,
        userLogoDto: UserLogoDto,
        user: User
    ): Promise<UserPreferences> {
        let userPreferences: UserPreferences = null;

        if (user)
            userPreferences = await user.userPreferences;

        if (!userPreferences){
            this.logger.verbose('creating new user preferences.')
            userPreferences = new UserPreferences();
        }

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

        const { headerLogo, footerLogo } = userLogoDto;
        if (headerLogo)
            userPreferences.headerLogo = this.convertFileToBase64(headerLogo);
        if (footerLogo)
            userPreferences.footerLogo = this.convertFileToBase64(footerLogo);

        await userPreferences.save();

        return userPreferences;
    }

    convertFileToBase64 (file: any): string {
        return `data:image/png;base64,${ file.buffer.toString('base64') }`;
    }
}
