import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PinDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly token: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly pin: string


  



}