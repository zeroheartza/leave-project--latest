import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePinDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly token: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly newPin: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly oldPin: string


  



}