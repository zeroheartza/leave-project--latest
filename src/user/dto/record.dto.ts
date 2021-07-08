import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RecordDto {


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly leaveId: string


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly statusHR: string


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly record: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly comment: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly pin: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly token: string

  
  



}