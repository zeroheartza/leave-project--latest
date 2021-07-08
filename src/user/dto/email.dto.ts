import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EmailDto {


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly email: string


  



}