import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app/app.module";
import {Logger} from "@nestjs/common";
import * as config from 'config';

const serverConfig = config.get('server');

const port = process.env.PORT || serverConfig.port;

async function bootstrap(){
    const logger = new Logger('bootstrap');

    const app = await NestFactory.create(AppModule);

    if (process.env.NODE_ENV === 'development') {
        app.enableCors();
    } else {
        app.enableCors();
        //app.enableCors({ origin: serverConfig.origin});
        logger.log(`Accepting requests from origin ${ serverConfig.origin }.`)
    }

    await app.listen(port);
    logger.log(`Application listening on port ${ port }`);
}

bootstrap();
