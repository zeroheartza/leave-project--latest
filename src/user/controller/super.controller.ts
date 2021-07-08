import { BadRequestException, Body, Controller, Delete, Get, Param, Post, ValidationPipe, Put, Res, HttpStatus, Injectable, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from 'bcrypt';
import { ValidationError } from "class-validator";
import { ApproveDto } from "../dto/approve.dto";
import { LeaveDto } from "../dto/leave.dto";
import { UserDto } from "../dto/user.dto";
import { TokenDto } from "../dto/token.dto";
import { LeaveIdDto } from "../dto/leaveId.dto";
import { LogDto } from "../dto/log.dto";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../service/admin.service";
import { AllUserService } from "../service/alluser.service";
import { SuperService } from "../service/super.service";
import { Response, Request, response } from 'express';
import { LeaveStaffDto } from "../dto/leaveStaff.dto";

@Injectable()
@ApiTags('supervisor')
@Controller('supervisor')
export class superController {
   constructor(
      private readonly adminService: AdminService,
      private readonly alluserService: AllUserService,
      private readonly superService: SuperService,
      private readonly jwtService: JwtService

   ) { }

  

   // **************** check *********************
   @Post('getStaffLeave')
   @ApiOkResponse()
   async getStaffLeave(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      const token = tokenDto.token
      const data = await this.jwtService.verifyAsync(token);
      const user = await this.adminService.findId(data['id']);
      const result = this.superService.getStaffLeave(user.userP[0].position);
      return result
   }


    // **************** check *********************
   @Post('getOneStaffLeave')
   @ApiOkResponse()
   async getLeaveId(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) leaveIdDto: LeaveIdDto
   ) {
      const data = await this.jwtService.verifyAsync(leaveIdDto.token);
      const result = this.superService.getOneStaffLeave(data['id'], leaveIdDto.leaveId);
      return result
   }

    // **************** check *********************
   @Post('approveLeave')
   @ApiOkResponse()
   async setPin(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) approveDto: ApproveDto
   ) {
      const data = await this.jwtService.verifyAsync(approveDto.token);
      return await this.superService.editLeave(data['id'], approveDto);
   }







   

}