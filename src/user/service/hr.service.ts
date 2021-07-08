import { LoginDto } from "../dto/login.dto";
import { UserDto } from "../dto/user.dto";
import { DeleteDto } from "../dto/delete.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { LeaveDto } from "../dto/leave.dto";
import { UserProfileDto } from "../dto/userProfile.dto";
import { enumRoleUser } from "../../core/enum";
import { ApproveDto } from "../dto/approve.dto";
import { RecordDto } from "../dto/record.dto";
import { Cron } from '@nestjs/schedule';
import { LeaveStaffDto } from "../dto/leaveStaff.dto";
import * as bcrypt from 'bcrypt';

export class HrService extends UserService {
    constructor() {
        super()
    }

    getApproveLeave(staffId: string) {
    
        const result = this.getLeaveHR(staffId)
        return  result
    }

    async getOneApproveLeave(role: string,leaveId :string) {
        const position = this.checkroleUser(role)
        return await this.findOneidApproveLeave(position,leaveId)
    }

    async addLeave(userId:string,leaveDto: LeaveDto) {

        return await this.addLeaveUser(userId,leaveDto)
    }


   

    async recordUserLeave(userId:string, recordDto: RecordDto) {
        const user = await this.findidEmail(recordDto.leaveId)
        const userData = await this.findidUser(userId)
        var time = new Date();
        const datetime = time.toString()
        // if (await bcrypt.compare(userData.userP[0].pin , recordDto.pin)) {
        if(await bcrypt.compare(recordDto.pin,userData.userP[0].pin)){
        
            await this.saveLogUser("บันทึกการลา", userId, "สำเร็จ",`ใบลาเลขที่คำร้อง ${recordDto.leaveId} ได้รับการ${recordDto.statusHR}`, datetime)
            await this.sendMail("บันทึกการลาเรียบร้อย",`${userData.userP[0].position} บันทึกใบลาเลขที่ ${recordDto.leaveId} ของคุณแล้ว`,user.email)
            return this.editRecordUserLeave(userId, recordDto)
        }
        else{
            return {message : "Pin is wrong"}
        } 
    }

   
}

