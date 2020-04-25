import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app/app.module";

async function bootstrap(){
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    return await app.listen(process.env.PORT || 4000);
}

bootstrap().catch(err => console.error(err));
