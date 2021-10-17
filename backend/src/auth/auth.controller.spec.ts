import { Test, TestingModule } from "@nestjs/testing";
import { BNetOauth2Controller } from "./bnet.auth.controller";

describe("AuthController", () => {
    let controller: BNetOauth2Controller;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BNetOauth2Controller],
        }).compile();

        controller = module.get<BNetOauth2Controller>(BNetOauth2Controller);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
