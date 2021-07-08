import { BadRequestException, Body, Controller, Delete, Get, Param, Post, ValidationPipe, Put, Res, HttpStatus, Injectable, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from 'bcrypt';
import { ValidationError } from "class-validator";
import { ApproveDto } from "../dto/approve.dto";
import { LeaveDto } from "../dto/leave.dto";
import { UserDto } from "../dto/user.dto";
import { TokenDto } from "../dto/token.dto";
import { RecordDto } from "../dto/record.dto";
import { LeaveIdDto } from "../dto/leaveId.dto";
import { LogDto } from "../dto/log.dto";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../service/admin.service";
import { AllUserService } from "../service/alluser.service";
import { SuperService } from "../service/super.service";
import { HrService } from "../service/hr.service";
import { Response, Request, response } from 'express';
import { LeaveStaffDto } from "../dto/leaveStaff.dto";

@Injectable()
@ApiTags('hr')
@Controller('hr')
export class hrController {
   constructor(
      private readonly adminService: AdminService,
      private readonly alluserService: AllUserService,
      private readonly superService: SuperService,
      private readonly hrService: HrService,
      private readonly jwtService: JwtService

   ) { }

  

    // **************** check *********************
   @Post('getApprovedLeave')
   @ApiOkResponse()
   async getApproveLeave(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
   
      const data = await this.jwtService.verifyAsync(tokenDto.token);
      const user = await this.adminService.findId(data['id']);
      const result = this.hrService.getApproveLeave(user.userP[0].staffId);
      return result
   }


    // **************** check *********************
   @Get('getAllUserProfile')
   @ApiOkResponse()
   async getUserAllProfile(
   ) {
      return this.adminService.getAllProfileUsers();
   }

    // **************** check *********************
   @Post('getOneApprovedLeave')
   @ApiOkResponse()
   async getOneApproveLeave(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) leaveIdDto: LeaveIdDto
   ) {

      const data = await this.jwtService.verifyAsync(leaveIdDto.token);
      const user = await this.adminService.findId(data['id']);
      const result = await this.hrService.getOneApproveLeave(user.userP[0].position, leaveIdDto.leaveId);
      return result
   }

    // **************** check *********************
   @Post('addLeave')
   async addLeave(
      @Body(new ValidationPipe({
         exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
      })) leaveDto: LeaveDto
      ) {
      const data = await this.jwtService.verifyAsync(leaveDto.token);
      const result = await this.hrService.addLeave(data['id'],leaveDto);
      return result
   }

    // **************** check *********************
   @Post('recordLeave')
   @ApiOkResponse()
   async setPin(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) recordDto: RecordDto
   ) {
      const data = await this.jwtService.verifyAsync(recordDto.token);
      return this.hrService.recordUserLeave(data['id'], recordDto);
   }







   

}