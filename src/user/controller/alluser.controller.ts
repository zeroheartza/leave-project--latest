import { BadRequestException, Body, Controller, Delete, Get, Param, Post, ValidationPipe, Put, Res, HttpStatus, Injectable, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from 'bcrypt';
import { ValidationError } from "class-validator";
import { LoginDto } from "../dto/login.dto";
import { PinDto } from "../dto/pin.dto";
import { ChangePinDto } from "../dto/changepin.dto";
import { UserProfileDto } from "../dto/userProfile.dto";
import { LeaveDto } from "../dto/leave.dto";
import { UserDto } from "../dto/user.dto";
import { EmailDto } from "../dto/email.dto";
import { TokenDto } from "../dto/token.dto";
import { LeaveIdDto } from "../dto/leaveId.dto";
import { LogDto } from "../dto/log.dto";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../service/admin.service";
import { AllUserService } from "../service/alluser.service";
import { Response, Request, response } from 'express';
import { LeaveStaffDto } from "../dto/leaveStaff.dto";
import { PasswordDto } from "../dto/password.dto";
import { EditUserProfileDto } from "../dto/edituserProfile.dto";

@Injectable()
@ApiTags('allUsers')
@Controller('allUsers')
export class alluserController {
   constructor(
      private readonly adminService: AdminService,
      private readonly alluserService: AllUserService,
      private readonly jwtService: JwtService

   ) { }


   // **************** check *********************
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

   // **************** check *********************
   @Post('sendLeaveStaff')
   async sendLeaveStaff(
      @Body(new ValidationPipe({
         exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
      })) leaveStaffDto: LeaveStaffDto, @Res({ passthrough: true }) response: Response
   ) {
      const result = await this.alluserService.addLeaveStaff(leaveStaffDto);
      return result
   }

   // **************** check *********************
   @Post('getLog')
   @ApiOkResponse()
   async getLog(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      try {
         const token = tokenDto.token
         const data = await this.jwtService.verifyAsync(token);
         // const statusRole = await this.alluserService.checkRoleUser(data);
 
         return this.adminService.logId(data['id'].toString());
   
       
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }

   // **************** check *********************
   @Post('getProfile')
   @ApiOkResponse()
   async getProfile(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      try {
         const token = tokenDto.token
         const data = await this.jwtService.verifyAsync(token);

         return this.alluserService.getProfileToken(data['id'].toString());

      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }

   // **************** check *********************
   @Post('editProfile')
   @ApiOkResponse()
   async editProfile(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) editUserProfileDto: EditUserProfileDto
   ) {
      const data = await this.jwtService.verifyAsync(editUserProfileDto.token);
      return this.alluserService.editAllUser(data['id'], editUserProfileDto);
   }



   // **************** check *********************
   @Post('changePassword')
   async changePassword(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) passwordDto: PasswordDto) {
      try {
         const data = await this.jwtService.verifyAsync(passwordDto.token);
         const result = await this.alluserService.editUserPassword(data['id'], passwordDto)
         return result;
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }

   // **************** check *********************
   @Post('changePin')
   async changePin(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) changePinDto: ChangePinDto) {
      try {
         const data = await this.jwtService.verifyAsync(changePinDto.token);
         const result = await this.alluserService.editUserPin(data['id'], changePinDto)
         return result;
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }


   // **************** check *********************
   @Post('setPin')
   @ApiOkResponse()
   async setPin(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) pinDto: PinDto
   ) {
      const data = await this.jwtService.verifyAsync(pinDto.token);
      return this.alluserService.addPin(data, pinDto);
   }


   // **************** check *********************
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
   
   
   @Get('mail')
   @ApiOkResponse()
   async mail(
   ) {
      return this.alluserService.testemail();
   }




   @Post('forgetPassword')
   @ApiOkResponse()
   async forgetPassword(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) emailDto: EmailDto
   ) {

  

      return this.alluserService.forget(emailDto.email);
   }


   @Post('forgetPin')
   @ApiOkResponse()
   async forgetPin(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      const data = await this.jwtService.verifyAsync(tokenDto.token);
      return this.alluserService.forgetPin(data['id']);
   }

   // **************** check *********************
   @Post('getUserProfile')
   @ApiOkResponse()
   async getProfileUsers(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {

      try {
         const token = tokenDto.token
         const data = await this.jwtService.verifyAsync(token);
         return this.adminService.getProfileUsers(data['id']);
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }


   // **************** check *********************
   @Post('getUserLeave')
   @ApiOkResponse()
   async getUserleaveId(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      try {
         const data = await this.jwtService.verifyAsync(tokenDto.token);
         const user = await this.adminService.findId(data['id']);
         const result = this.alluserService.getLeaveAllId(user.userP[0].staffId,user.userP[0].position);
         return result
      } catch (e) {
         return {

            message: "Can't find token"
         }
      }
   }


   // **************** check *********************
   @Post('getOneLeave')
   @ApiOkResponse()
   async getOneLeave(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) leaveIdDto: LeaveIdDto
   ) {
      const token = leaveIdDto.token
      const data = await this.jwtService.verifyAsync(token);
      const user = await this.adminService.findId(data['id']);
      const result = this.alluserService.getLeavesId(leaveIdDto.leaveId);
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