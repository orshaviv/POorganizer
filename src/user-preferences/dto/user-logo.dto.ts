
export class UserLogoDto {
    public headerLogo: any;
    public footerLogo: any;

    public static validateData (userLogoDto: UserLogoDto) {
        if (userLogoDto) {
            if (userLogoDto.headerLogo && userLogoDto.headerLogo.length > 0)
                userLogoDto.headerLogo = userLogoDto.headerLogo[0];
            else
                userLogoDto.headerLogo = null

            if (userLogoDto.footerLogo && userLogoDto.footerLogo.length > 0)
                userLogoDto.footerLogo = userLogoDto.footerLogo[0];
            else
                userLogoDto.footerLogo = null
        }else{
            userLogoDto = new UserLogoDto();
            userLogoDto.headerLogo = null;
            userLogoDto.footerLogo = null;
        }
        return userLogoDto;
    }
}
