import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EditUserProfileDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly token: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly firstName: string



    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly lastName: string




    @IsString()
    @ApiProperty()
    readonly phone: string







}