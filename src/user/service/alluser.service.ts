import { LoginDto } from "../dto/login.dto";
import { UserDto } from "../dto/user.dto";
import { DeleteDto } from "../dto/delete.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { LeaveDto } from "../dto/leave.dto";
import { UserProfileDto } from "../dto/userProfile.dto";
import { enumRoleUser } from "../../core/enum";
import { PinDto } from "../dto/pin.dto";
import { Cron } from '@nestjs/schedule';
import { LeaveStaffDto } from "../dto/leaveStaff.dto";

export class AllUserService extends UserService {
    constructor() {
        super()
    }
    @Cron('0 00 9 * * 1-5')
    async runEvery10Seconds() {
        this.updateDate() 
    }
    addLeaveStaff(leaveStaffDto: LeaveStaffDto) {
        return this.addLeaveUserStaff(leaveStaffDto)
    }

    async login(status:boolean,userId:string,message:string,jwt:any) {
        var time = new Date();
        const datetime = time.toString()
        if (status) {
            const user = await this.findidUser(userId);
            const role = user.userP[0].position
            const roleUser = await this.checkroleUser(role)
            console.log(roleUser)
            await this.saveLogUser("เข้าสู่ระบบ", userId, "-", "สำเร็จ",datetime)
            if(user.userP[0].pin!=""){
               const status ="True" 
               return { message: "Login Success", token: jwt,role:roleUser ,pinStatus:status}
            }
            else{
               const status ="False" 
               return { message: "Login Success", token: jwt,role:roleUser ,pinStatus:status}
            }
        }
        else{
            await this.saveLogUser("เข้าสู่ระบบ", userId, "-", "ไม่สำเร็จ",datetime)
            return message
        }
    }

    async findEmail(loginDto: LoginDto) {
        const result = await this.findemailUser(loginDto)
        if (result.message !== "Invalid email") {
            if (result.message !== "Incorrect password") {
               return { status: true , message: result.message,userId : result.id }
            }
            else {
               return {status: false , message: result.message,userId : result.id  }
            }
         }
         else {
            return {status: false , message: result.message,userId : result.id }
         }
    }

    getLeaveAllId(id: string) {
        return this.findidLeave(id)
    }
    getLeavesId(id: string,leaveId :string) {
        return this.findOneidLeave(id,leaveId)
    }


    async checkRoleUser(data: any) {
        const user = await this.findidUser(data['id']);
        const role = user.userP[0].position
        const roleUser = this.checkroleUser(role)
        if (roleUser == enumRoleUser.HR) {
            return true
        }
        if (roleUser == enumRoleUser.staff) {
            return true
        }
        if (roleUser == enumRoleUser.super) {
            return true
        }
        else {
            return false
        }
    
    }

}

