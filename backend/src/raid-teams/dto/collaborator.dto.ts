import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { CollaboratorRole } from "src/commons/user-roles";

export class CollaboratorDto {
    @ApiProperty({ enum: CollaboratorRole })
    @IsEnum(CollaboratorRole)
    role: CollaboratorRole;
}
