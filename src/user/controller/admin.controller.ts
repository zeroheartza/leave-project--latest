import { BadRequestException, Body, Controller, Delete, Get, Param, Post, ValidationPipe, Put, Res, HttpStatus, Injectable, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from 'bcrypt';
import { ValidationError } from "class-validator";
import { LoginDto } from "../dto/login.dto";
import { DeleteDto } from "../dto/delete.dto";
import { LeaveDto } from "../dto/leave.dto";
import { LeaveStaffDto } from "../dto/leaveStaff.dto";
import { UserDto } from "../dto/user.dto";
import { UserProfileDto } from "../dto/userProfile.dto";
import { PinDto } from "../dto/pin.dto";
import { TokenDto } from "../dto/token.dto";
import { IdDto } from "../dto/id.dto";
import { LogDto } from "../dto/log.dto";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../service/admin.service";
import { Response, Request, response } from 'express';
import { enumRoleUser } from "../../core/enum";
import { resolveConfig } from "prettier";
import { AllUserService } from "../service/alluser.service";

@Injectable()
@ApiTags('Administrator')
@Controller('admin')
export class adminController {

   constructor(
      private readonly adminService: AdminService,
      private readonly jwtService: JwtService,
      private readonly alluserService: AllUserService,
   ) { }


   // **************** Create *********************

   @Post('createAdmin')
   @ApiOkResponse()
   async createAdmin(
   ) {
      return this.adminService.createAdmin();
   }

   @Post('addLeave')
   async addLeave(
      @Body(new ValidationPipe({
         exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
      })) leaveDto: LeaveDto, @Res({ passthrough: true }) response: Response
   ) {
      const result = await this.adminService.addLeaveUser(leaveDto, response);
      return { message: result }
   }




   @Post('createUser')
   @ApiOkResponse()
   async createUser(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) userDto: UserDto
   ) {
      const data = await this.jwtService.verifyAsync(userDto.token);
      const user = await this.adminService.createUser(userDto, data);
      return user
   }



   // **************** Read *********************

   @Get('getTypeLeave')
   @ApiOkResponse()
   async getTypeLeave(
   ) {
      return this.adminService.getType();
   }

   @Post('checkRole')
   @ApiOkResponse()
   async checkRole(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto, @Res({ passthrough: true }) res: Response
   ) {
      const token = tokenDto.token
      const data = await this.jwtService.verifyAsync(token);
      const roleUser = this.adminService.checkRole(data);
      return roleUser
   }

   @Get('getUser')
   @ApiOkResponse()
   async getUsers(@Res() res: Response
   ) {
      return this.adminService.getuser(res);
   }


   @Post('getUserProfile')
   @ApiOkResponse()
   async getProfileUsers(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      const token = tokenDto.token
      const data = await this.jwtService.verifyAsync(token);
      return this.adminService.getProfileUsers(data['id']);
   }

   @Get('getAllUserProfile')
   @ApiOkResponse()
   async getUserAllProfile(
   ) {
      return this.adminService.getAllProfileUsers();
   }


   @Get('getUserleave')
   @ApiOkResponse()
   async getUserleave() {
      return this.adminService.getLeaveUsers();
   }


   @Post('getLogAll')
   @ApiOkResponse()
   async getLogAll(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      try {
         const data = await this.jwtService.verifyAsync(tokenDto.token);
         const statusRole = await this.adminService.checkRoleAdmin(data);
         if (statusRole) {
            return this.alluserService.findLogAll();
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

   @Get('lookUp')
   @ApiOkResponse()
   async getLookUp(
   ) {


      return this.adminService.getlookUp();
   }


   // **************** Update *********************


   @Post('editUser')
   @ApiOkResponse()
   async editUser(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) userProfileDto: UserProfileDto
   ) {
      console.log(userProfileDto)
      return this.adminService.editUser(userProfileDto);


   }


   @Post('setPin')
   @ApiOkResponse()
   async setPin(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) pinDto: PinDto, @Res({ passthrough: true }) res: Response
   ) {
      const data = await this.jwtService.verifyAsync(pinDto.token);
      return this.adminService.editPin(data, pinDto);
   }


   // **************** Delete *********************

   @Post('deleteUser')
   @ApiOkResponse()
   async deleteUser(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) deleteDto: DeleteDto
   ) {
      try {
         const token = deleteDto.token
         const userId = await this.jwtService.verifyAsync(token);
         return this.adminService.deleteUser(deleteDto, userId);
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }
}