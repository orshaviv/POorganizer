import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {UserPreferences} from "./user-preferences.entity";
import {UserPreferencesService} from "./user-preferences.service";
import {UserPreferencesController} from "./user-preferences.controller";
import {UserPreferencesRepository} from "./user-preferences.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserPreferencesRepository,
        ]),
        AuthModule,
    ],
    providers: [UserPreferencesService],
    controllers: [UserPreferencesController],
    exports: [UserPreferencesService],
})

export class UserPreferencesModule {}
