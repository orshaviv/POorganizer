export class UserValidationDto {
    username: string;
    email: string;
    firstName: string;
    lastName: string;

    public constructor(username: string, email: string, firstName: string, lastName: string) {
        this.username = username;
        this.email=  email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
