import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import { User, UsersService } from "src/users/users.service";

@Injectable()
export class BNetOauth2Strategy extends PassportStrategy(Strategy, "bnet") {
    // TODO: Other regions
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
            console.log("Received access token from battlenet oauth. Getting user info.");
            const res = await this.httpService
                .get("https://eu.battle.net/oauth/userinfo", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .toPromise();

            const userInfo = res.data as User;
            // If the token had an issue, we might get a response with a 200 status code
            // that returns some html. For us, this would mean failed authentication, so
            // we should throw an error.
            if (!userInfo.id || !userInfo.battletag) {
                throw new HttpException(
                    "Unknown error while getting user info from battlenet",
                    500,
                );
            }
            console.log("Successfully received user info from battlenet:");
            console.log(JSON.stringify(userInfo, null, 4));

            return await this.usersService.findOrCreate(userInfo);
        } catch (exception) {
            console.log(
                `Error while getting user info from battlenet: ${exception?.response?.status}`,
            );
            return null;
        }
    }
}
