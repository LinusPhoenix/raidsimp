import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import { lastValueFrom } from "rxjs";
import { User } from "src/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class BNetOauth2Strategy extends PassportStrategy(Strategy, "bnet") {
    private readonly logger = new Logger(BNetOauth2Strategy.name);
    constructor(
        private readonly httpService: HttpService,
        private readonly usersService: UsersService,
    ) {
        super({
            authorizationURL: `https://eu.battle.net/oauth/authorize`,
            tokenURL: `https://eu.battle.net/oauth/token`,
            clientID: process.env.BLIZZARD_API_CLIENT_ID,
            clientSecret: process.env.BLIZZARD_API_CLIENT_SECRET,
            callbackURL: process.env.BLIZZARD_OAUTH_CALLBACK_URL,
        });
    }

    async validate(accessToken: string): Promise<User> {
        try {
            // The access tokens issued by battle net are not JWTs we can decrypt ourselves.
            // To be able to read the data contained in the access token (user id, battletag),
            // we need to call their /oauth/userinfo endpoint.
            this.logger.log("Received access token from battlenet oauth. Getting user info.");
            const res = await lastValueFrom(
                this.httpService.get("https://eu.battle.net/oauth/userinfo", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            );

            const userInfo = res.data as { id: number; battletag: string };
            // If the token had an issue, we might get a response with a 200 status code
            // that returns some html. For us, this would mean failed authentication, so
            // we should throw an error.
            if (!userInfo.id || !userInfo.battletag) {
                throw new HttpException(
                    "Unknown error while getting user info from battlenet",
                    500,
                );
            }
            this.logger.log(
                "Successfully received user info from battlenet:\n" +
                    JSON.stringify(userInfo, null, 4),
            );

            return await this.usersService.findOrCreate(userInfo);
        } catch (exception) {
            this.logger.warn(
                `Error while getting user info from battlenet: ${exception?.response?.status}`,
            );
            return null;
        }
    }
}
