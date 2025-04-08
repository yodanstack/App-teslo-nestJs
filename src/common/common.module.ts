import { Module } from '@nestjs/common';
import { PaginationDto } from './dtos/pagination.dto';

@Module({
    exports:[PaginationDto]
})
export class CommonModule {}
