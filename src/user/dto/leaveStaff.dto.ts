import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LeaveStaffDto {

    

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly staffId: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly position: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly department: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly location: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly phone : string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly typeLeave: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly startDate: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly endDate: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly total: string  

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly reason: string



    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly status: string

    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly pin: string






}