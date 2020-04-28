import {IsEmail, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(
        /(?=.*[A-Z])(?=.*[a-z]).*$/ ,
        {message: 'Password must contain uppercase and lowercase and characters.'}
        )
    @Matches(
        /(?=.*[0-9]).*$/ ,
        {message: 'Password must contain a number.'}
    )
    password: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}
