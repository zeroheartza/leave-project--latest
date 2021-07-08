import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ApproveDto {


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly leaveId: string


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly status: string


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly reasonSuper: string

    

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly token: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly pin: string

  
  



}