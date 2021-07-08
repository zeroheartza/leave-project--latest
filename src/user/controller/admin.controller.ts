import { BadRequestException, Body, Controller, Delete, Get, Param, Post, ValidationPipe, Put, Res, HttpStatus, Injectable, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from 'bcrypt';
import { ValidationError } from "class-validator";
import { LoginDto } from "../dto/login.dto";
import { DeleteDto } from "../dto/delete.dto";
import { LeaveDto } from "../dto/leave.dto";
import { LeaveStaffDto } from "../dto/leaveStaff.dto";
import { UserDto } from "../dto/user.dto";
import { AdminDto } from "../dto/admin.dto";
import { UserProfileDto } from "../dto/userProfile.dto";

import { TokenDto } from "../dto/token.dto";
import { IdDto } from "../dto/id.dto";
import { LogDto } from "../dto/log.dto";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../service/admin.service";
import { Response, Request, response } from 'express';
import { enumRoleUser } from "../../core/enum";
import { resolveConfig } from "prettier";
import { AllUserService } from "../service/alluser.service";
import { LeaveIdDto } from "../dto/leaveId.dto";
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
   async createAdmin(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) adminDto:AdminDto
   ){
      return await this.adminService.createAdmin(adminDto);
   }

   




   // **************** check *********************
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

   // @Get('getTypeLeave')
   // @ApiOkResponse()
   // async getTypeLeave(
   // ) {
   //    return this.adminService.getType();
   // }

   // @Post('checkRole')
   // @ApiOkResponse()
   // async checkRole(@Body(new ValidationPipe({
   //    exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   // })) tokenDto: TokenDto, @Res({ passthrough: true }) res: Response
   // ) {
   //    const token = tokenDto.token
   //    const data = await this.jwtService.verifyAsync(token);
   //    const roleUser = this.adminService.checkRole(data);
   //    return roleUser
   // }



   // @Get('getUser')
   // @ApiOkResponse()
   // async getUsers(
   // ) {
   //    return this.adminService.getuser();
   // }



   // **************** check *********************
   @Get('getAllUserProfile')
   @ApiOkResponse()
   async getUserAllProfile(
   ) {
      return this.adminService.getAllProfileUsers();
   }


   // **************** check *********************
   @Get('getAllUserleave')
   @ApiOkResponse()
   async getAllUserleave() {
      return this.adminService.getLeaveUsers();
   }


   // **************** check *********************
   @Post('getAllLog')
   @ApiOkResponse()
   async getLogAll(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) tokenDto: TokenDto
   ) {
      try {
         const data = await this.jwtService.verifyAsync(tokenDto.token);
         const statusRole = await this.adminService.checkRoleAdmin(data['id']);
         if (statusRole) {
            return this.adminService.logAll();
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




   // **************** check *********************
   @Get('lookUp')
   @ApiOkResponse()
   async getLookUp(
   ) {


      return this.adminService.getlookUp();
   }


   // **************** Update *********************


   // **************** check *********************
   @Post('editUser')
   @ApiOkResponse()
   async editUser(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) userProfileDto: UserProfileDto
   ) {
      const userId = await this.jwtService.verifyAsync(userProfileDto.token);
      return this.adminService.editUser(userId['id'],userProfileDto);
   }


   // **************** Delete *********************

   // **************** check *********************
   @Post('deleteUser')
   @ApiOkResponse()
   async deleteUser(@Body(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => new BadRequestException(errors),
   })) deleteDto: DeleteDto
   ) {
      try {
         const userId = await this.jwtService.verifyAsync(deleteDto.token);
    
         return this.adminService.deleteUser(deleteDto, userId['id']);
      } catch (e) {
         return {
            message: "Can't find token"
         }
      }
   }
}