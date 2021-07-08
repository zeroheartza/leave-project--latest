import { LoginDto } from "../dto/login.dto";
import { ChangePinDto } from "../dto/changepin.dto";
import { UserDto } from "../dto/user.dto";
import { DeleteDto } from "../dto/delete.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { LeaveDto } from "../dto/leave.dto";
import { EditUserProfileDto } from "../dto/edituserProfile.dto";
import { enumRoleUser } from "../../core/enum";
import { PinDto } from "../dto/pin.dto";
import { Cron } from '@nestjs/schedule';
import { LeaveStaffDto } from "../dto/leaveStaff.dto";
import { PasswordDto } from "../dto/password.dto";

export class AllUserService extends UserService {
    constructor() {
        super()
    }
    @Cron('00 01 00 * * 1-7')
    async runEvery10Seconds() {
        this.updateDate()
    }


    testemail() {
        return this.sendMail("test email", "test detail", "heartnxz02@gmail.com")
    }



    async addLeaveStaff(leaveStaffDto: LeaveStaffDto) {
        const user = await this.addLeaveUserStaff(leaveStaffDto)
        if (user.message == "Submit success") {
            await this.saveLogUser("ส่งใบลา", user.userId.toString(), "สำเร็จ", `ผู้ใช้ทำการส่งใบลาเลขที่คำร้อง ${user.leaveId.toString()}`, user.date)
            return { message: user.message }
        }
        else {
            return { message: user.message }
        }

    }

    getProfileToken(userId: string) {
        return this.getUserProfile(userId)
    }

    editUserPassword(userId: string, passwordDto: PasswordDto) {
        return this.editPassword(userId, passwordDto)
    }


    editUserPin(userId: string, changePinDto: ChangePinDto) {
        return this.editPin(userId, changePinDto)
    }

    async addPin(data: any, pinDto: PinDto) {
        const userId = data['id'];
        return this.addUserPin(userId, pinDto)
    }

    editAllUser(userId: string, editUserProfileDto: EditUserProfileDto) {
        return this.editUserProfile(userId, editUserProfileDto)
    }





    async login(status: boolean, userId: string, message: string, jwt: any) {
        var time = new Date();
        const datetime = time.toString()
        const user = await this.findidUser(userId);
        if (userId != "") {
            if (status) {
                const role = user.userP[0].position
                const roleUser = await this.checkroleUser(role)
                await this.saveLogUser("เข้าสู่ระบบ", userId, "สำเร็จ", `มีการเข้าสู่ระบบของผู้ใช้ ${user.userP[0].firstName + " " + user.userP[0].lastName}`, datetime)
                if (user.userP[0].position == "Chief Executive Officer​") {
                    if (user.userP[0].pin != "") {
                        const status = "True"
                        return { message: "Login Success", token: jwt, role: roleUser, pinStatus: status, name: user.userP[0].firstName + " " + user.userP[0].lastName, staffId: user.userP[0].staffId, language:"eng"}
                    }
                    else {
                        const status = "False"
                        return { message: "Login Success", token: jwt, role: roleUser, pinStatus: status, name: user.userP[0].firstName + " " + user.userP[0].lastName, staffId: user.userP[0].staffId, language:"eng"}
                    }
                }
                else{
                    if (user.userP[0].pin != "") {
                        const status = "True"
                        return { message: "Login Success", token: jwt, role: roleUser, pinStatus: status, name: user.userP[0].firstName + " " + user.userP[0].lastName, staffId: user.userP[0].staffId, language:"thai"}
                    }
                    else {
                        const status = "False"
                        return { message: "Login Success", token: jwt, role: roleUser, pinStatus: status, name: user.userP[0].firstName + " " + user.userP[0].lastName, staffId: user.userP[0].staffId, language:"thai"}
                    }

                }
            }
            else {
                await this.saveLogUser("เข้าสู่ระบบ", userId, "ไม่สำเร็จ", `มีการเข้าสู่ระบบของผู้ใช้ ${user.userP[0].firstName + " " + user.userP[0].lastName}`, datetime)
                return message
            }
        }
        else {
            return message
        }
    }

    async findEmail(loginDto: LoginDto) {
        const result = await this.findemailUser(loginDto)
        if (result.message !== "Invalid email") {
            if (result.message !== "Incorrect password") {
                return { status: true, message: result.message, userId: result.id }
            }
            else {
                return { status: false, message: result.message, userId: result.id }
            }
        }
        else {
            return { status: false, message: result.message, userId: result.id }
        }
    }


    getLeaveAllId(id: string, position: string) {
        return this.findidLeave(id, position)
    }
    getLeavesId(leaveId: string) {
        return this.findOneidLeave(leaveId)
    }


    async forget(email: string) {
        const userData = await this.findideMailId(email)
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        this.forgetPasswordUser(userData.user.email, retVal)
        const data = await this.sendMail("ลืมรหัสผ่าน", `รหัสผ่านใหม่ของคุณคือ ${retVal}`, userData.user.email)
        return data
    }

    async forgetPin(userId: string) {
        const userData = await this.findidUser(userId)
        var length = 6,
            charset = "0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        this.forgetPinUser(userData.user[0].userId.toString(), retVal)
        const data = await this.sendMail("ลืม Pin", `Pin ใหม่ของคุณคือ ${retVal}`, userData.user[0].email)
        return data
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
        if (roleUser == enumRoleUser.admin) {
            return true
        }
        else {
            return false
        }

    }


}

