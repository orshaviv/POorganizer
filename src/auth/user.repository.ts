import {EntityRepository, Repository} from "typeorm";
import {User} from "./user.entity";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {ConflictException, InternalServerErrorException} from "@nestjs/common";

import * as bcrypt from 'bcryptjs';


@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialDto: AuthCredentialsDto):
        Promise<void>
    {
        const {username, password, email, firstName, lastName} = authCredentialDto;

        const user = new User();
        user.username = username;

        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;

        try{
            await user.save();
        } catch(error) {
            if (error.code === 'ER_DUP_ENTRY'){ //duplicate username or email
                throw new ConflictException('Username or email already exists.');
            }else{
                console.log(error.code)
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto):
        Promise<{
            username: string,
            email: string,
            firstName: string,
            lastName: string
        }>
    {

        const {username, password} = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return {
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            };
        }else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string):
        Promise<string>
    {
        return bcrypt.hash(password, salt);
    }
}
