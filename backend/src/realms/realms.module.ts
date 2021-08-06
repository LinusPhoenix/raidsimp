import { Module } from '@nestjs/common';
import { RealmsController } from './realms.controller';
import { RealmsService } from './realms.service';

@Module({
    providers: [RealmsService],
    controllers: [RealmsController]
})
export class RealmsModule {}
