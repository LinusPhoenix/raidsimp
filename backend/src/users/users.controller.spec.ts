import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Response } from "express";

describe("UsersController", () => {
    let usersController: UsersController;
    let usersService: UsersService;

    const user: User = {
        battletag: "abc#123",
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        usersController = moduleRef.get<UsersController>(UsersController);
    });

    describe("getUserInfo", () => {
        it("should call usersService.findOne with user's battletag", async () => {
            const findOne = jest
                .spyOn(usersService, "findOne")
                .mockImplementation(async () => user);

            expect(await usersController.getUserInfo(user)).toBe(user);
            expect(findOne).toBeCalled();
        });
    });
    describe("deleteUser", () => {
        it("should call usersService.remove with user's battletag", async () => {
            const res: any = {};
            res.clearCookie = jest.fn();
            res.sendStatus = jest.fn();

            const remove = jest.spyOn(usersService, "remove").mockImplementation();

            expect(await usersController.deleteUser(user, res)).toBe(undefined);
            expect(remove).toBeCalled();
        });
    });
});
