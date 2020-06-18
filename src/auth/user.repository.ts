import {EntityRepository, Repository} from "typeorm";
import {User} from "./user.entity";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {ConflictException, InternalServerErrorException, Logger} from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import {UserValidationDto} from "./dto/user-validation.dto";
import {UserPreferences} from "../user-preferences/user-preferences.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private logger = new Logger('UserRepository');
    async signUp(
        userPreferences: UserPreferences,
        authCredentialDto: AuthCredentialsDto
    ): Promise<void> {
        const {username, password, email, firstName, lastName} = authCredentialDto;

        const user = new User();
        user.username = username;

        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;

        user.userPreferences = userPreferences;

        try{
            await user.save();
        } catch(error) {
            if (error.code === 'ER_DUP_ENTRY'){ //duplicate username or email
                throw new ConflictException('Username or email already exists.');
            }else{
                this.logger.error(`Failed adding new user ${user.username}.`, error.stack);
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(
        authCredentialsDto: AuthCredentialsDto
    ): Promise<UserValidationDto> {
        const {username, password} = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            const userValidationDto = new UserValidationDto(
                user.username,
                user.email,
                user.firstName,
                user.lastName
            );
            return userValidationDto;
        }else {
            return null;
        }
    }

    private async hashPassword(
        password: string, salt: string
    ): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
