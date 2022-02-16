import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as Path from "path";
import * as Fs from "fs";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle("RaidSIMP OpenAPI Spec")
        .setDescription("Manage your raid teams, enhanced with data from the Blizzard API.")
        .setVersion("0.1")
        .addSecurity("cookieAuth", {
            type: "apiKey",
            in: "cookie",
            name: "accessToken",
        })
        .addSecurityRequirements("cookieAuth")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("", app, document);

    // generate the OpenAPI specification file
    if (!["production", "test"].includes(process.env.NODE_ENV)) {
        const fileName = "openapi-spec.json";
        const outputPath = Path.resolve(process.cwd(), fileName);
        Fs.writeFile(outputPath, JSON.stringify(document), { encoding: "utf8" }, () =>
            console.debug(fileName + " generated"),
        );
    }

    app.enableCors({
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
