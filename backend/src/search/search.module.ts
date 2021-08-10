import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
    imports: [HttpModule],
    providers: [SearchService],
    controllers: [SearchController]
})
export class SearchModule {}
