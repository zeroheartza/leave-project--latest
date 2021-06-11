import { BadRequestException, Body, Controller, Delete, Get, Param, Post, ValidationPipe, Put, Res, HttpStatus, Injectable, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from 'bcrypt';
import { ValidationError } from "class-validator";
import { LoginDto } from "../dto/login.dto";
import { LeaveDto } from "../dto/leave.dto";
import { UserDto } from "../dto/user.dto";
import { TokenDto } from "../dto/token.dto";
import { LeaveIdDto } from "../dto/leaveId.dto";
import { LogDto } from "../dto/log.dto";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../service/admin.service";
import { AllUserService } from "../service/alluser.service";
import { Response, Request, response } from 'express';
import { LeaveStaffDto } from "../dto/leaveStaff.dto";

@Injectable()
@ApiTags('allusers')
@Controller('allusers')
export class alluserController {
   constructor(
      private readonly adminService: AdminService,
      private readonly alluserService: AllUserService,
      private readonly jwtService: JwtService

   ) { }

   @Post('login')
   async login(
      @Body(new ValidationPipe({
         exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
      })) loginDto: LoginDto
   ) {
      const result = await this.alluserService.findEmail(loginDto);
      const jwt = await this.jwtService.signAsync({ id: result.userId });
      return this.alluserService.login(result.status, result.userId, result.message, jwt)
   }

   @Post('addLeaveStaff')
   async addLeaveStaff(
      @Body(new ValidationPipe({
         exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
      })) leaveStaffDto: LeaveStaffDto, @Res({ passthrough: true }) response: Response
   ) {
      console.log(leaveStaffDto)
      const result = await this.alluserService.addLeaveStaff(leaveStaffDto);
      return result
   }


   @Post('getLogId')
   @ApiOkResponse()
   async getPrgetLogIdofileId(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      try {
         const token = tokenDto.token
         const data = await this.jwtService.verifyAsync(token);
         const statusRole = await this.alluserService.checkRoleUser(data);
         if (statusRole) {
            return this.adminService.logId(data['id'].toString());
         }
         else {
            return { message: "you are not admin" }
         }
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }






   @Post('user')
   async user(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto) {
      try {
         const data = await this.jwtService.verifyAsync(tokenDto.token);
         const roleUser = this.adminService.checkRole(data['id']);
         return { message: roleUser };
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }

   @Post('logout')
   async logout(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto) {
      try {
         const data = await this.jwtService.verifyAsync(tokenDto.token);
         return {
            message: "logout Success"
         }
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }


   @Get('getTypeLeave')
   @ApiOkResponse()
   async getTypeLeave(
   ) {
      return this.adminService.getType();
   }


   @Post('getUserLeaveId')
   @ApiOkResponse()
   async getUserleaveId(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      const token = tokenDto.token
      const data = await this.jwtService.verifyAsync(token);
      const user = await this.adminService.findId(data['id']);
      const result = this.alluserService.getLeaveAllId(user.userP[0].staffId);
      return result
   }


   @Post('getOneLeaveId')
   @ApiOkResponse()
   async getLeaveId(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) leaveIdDto: LeaveIdDto
   ) {
      const token = leaveIdDto.token
      const data = await this.jwtService.verifyAsync(token);
      const user = await this.adminService.findId(data['id']);
      const result = this.alluserService.getLeavesId(user.userP[0].staffId, leaveIdDto.leaveId);
      return result
   }

   @Post('checkRole')
   @ApiOkResponse()
   async checkRole(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      const token = tokenDto.token
      const data = await this.jwtService.verifyAsync(token);
      const user = await this.adminService.findId(data['id']);
      const roleUser = this.adminService.checkRole(user.userP[0].position);
      return roleUser
   }

}