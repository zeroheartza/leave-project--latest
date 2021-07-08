import { LoginDto } from "../dto/login.dto";
import { UserDto } from "../dto/user.dto";
import { DeleteDto } from "../dto/delete.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { LeaveDto } from "../dto/leave.dto";
import { UserProfileDto } from "../dto/userProfile.dto";
import { enumRoleUser } from "../../core/enum";
import { ApproveDto } from "../dto/approve.dto";
import * as bcrypt from 'bcrypt';
import { Cron } from '@nestjs/schedule';
import { LeaveStaffDto } from "../dto/leaveStaff.dto";

export class SuperService extends UserService {
    constructor() {
        super()
    }

    getStaffLeave(role: string) {
        const user =  this.checkroleLeaveUser(role)
        const result = this.getLeaveSuper(user,role)
        return  result
    }

    async getOneStaffLeave(id: string,leaveId :string) {
        
        const user = await this.findidUser(id)
        const position =  this.checkroleLeaveUser(user.userP[0].position)
        return this.findOneidStaffLeave(position,leaveId)
    }

    async editLeave(userId:string, approveDto: ApproveDto) {
        const user = await this.findidEmail(approveDto.leaveId)
        const userSuper = await this.findidUser(userId)
        var time = new Date();
        const datetime = time.toString()
        if(await bcrypt.compare(approveDto.pin,userSuper.userP[0].pin)){
            await  this.sendMail("อนุมัติการลาเรียบรอย",`${userSuper.userP[0].position} อนุมัติใบลาเลขที่ ${approveDto.leaveId}  ของคุณแล้ว`,user.email)
            await this.saveLogUser("อนุมัติการลา", userId, "สำเร็จ" ,`ใบลาเลขที่คำร้อง ${approveDto.leaveId} ได้รับการ${approveDto.status}`, datetime)
           
            return this.editUserLeave(userId, approveDto)
        }
        else{
            return {message : "Pin is wrong"}
        }
    } 
}

