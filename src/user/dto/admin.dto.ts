import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AdminDto {
 

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly firstName: string
    


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly lastName: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly password: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly staffId: string


    @IsString()
    @ApiProperty()
    readonly phone: string

    

    @IsString()
    @ApiProperty()
    readonly startingDate: string


    @IsString()
    @ApiProperty()
    readonly annualLeave: string

    @IsString()
    @ApiProperty()
    readonly businessLeave: string

    @IsString()
    @ApiProperty()
    readonly sickLeave: string




}