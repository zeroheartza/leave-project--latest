
import { LoginDto } from "../dto/login.dto";
import { UserDto } from "../dto/user.dto";
import { AdminDto } from "../dto/admin.dto";
import { DeleteDto } from "../dto/delete.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { LeaveDto } from "../dto/leave.dto";
import { UserProfileDto } from "../dto/userProfile.dto";
import { enumRoleUser } from "../../core/enum";
import { PinDto } from "../dto/pin.dto";
import { LeaveStaffDto } from "../dto/leaveStaff.dto";
export class AdminService extends UserService {
    constructor() {
        super()
    }

    async createAdmin(adminDto:AdminDto) {
        const user = await this.addAdmin(adminDto);
        return user
    }


    async createUser(userDto: UserDto, data: any) {
        try {
            const user = await this.findidUser(data['id']);
            
            const role = user.userP[0].position
            const roleUser = this.checkroleUser(role);
            if (roleUser == enumRoleUser.admin) {
                const res = await this.addUser(userDto);
                var time = new Date();
                const datetime = time.toString()
                await this.saveLogUser("เพิ่มผู้ใช้", user.user[0].userId.toString() , "สำเร็จ", `เพิ่มผู้ใช้งาน ${userDto.firstName} ${userDto.lastName}`, datetime)
                return { message: res.message }
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
    async editUser(userId:string,userProfileDto: UserProfileDto) {
        var time = new Date();
        const datetime = time.toString()
        const user = await this.editUserProfileAdmin(userProfileDto)
       
        
        if(user.message==="Edit profile Success"){
            await this.saveLogUser("แก้ไขข้อมูล", userId.toString(), "สำเร็จ", `แก้ไขข้อมูของ ${user.name}`, datetime)
            return {message:user.message}
        }
        else{
            return {message:user.message}
        }
       
    }

 

    async deleteUser(deleteDto: DeleteDto,userId:string) {
        const user = await this.findidUser(userId);
        const role = user.userP[0].position
        const roleUser = this.checkroleUser(role)
        if (roleUser == enumRoleUser.admin) {
            var time = new Date();
            const datetime = time.toString()
            const user = await this.getProfile(deleteDto.userId)
            const result = this.saveLogUser("ลบผู้ใช้", userId, "สำเร็จ", `ลบผู้ใช้งาน  ${user.message.name}` ,datetime)
            return this.delUser(+deleteDto.userId)
        }
        else {
            return { message: "you are not admin" }
        }
        
    }

   
  
    findId(id: string) {
        return this.findidUser(id)
    }

    logAll() {
        return this.findLogAll()
    }


    logId(id: string) {
        return this.findLogId(id)
    }

    getlookUp() {
        return this.getLookUp()
    }

    getLeavesIdAdmin(position: string,leaveId :string) {
        return this.findOneidLeaveAdmin(position,leaveId)
    }


    getType() {
        return this.getTypeLeave()
    }

    getUserId(id: string) {
        return this.getUserWhereId(id)
    }

    async checkRole(id:string) {
        const user = await this.findidUser(id);
        const role = user.userP[0].position
        const roleUser = await this.checkroleUser(role)
        return roleUser
    }

    getuser() {
        return this.getUser()
    }

    async checkRoleAdmin(userId:string) {
        const user = await this.findidUser(userId);
        const role = user.userP[0].position
        const roleUser = this.checkroleUser(role)
        if (roleUser == enumRoleUser.admin) {
            return true
        }
        else {
            return false
        }
    }



    getProfileUsers(userId: string) {
        return this.getProfile(userId)
    }


    getAllProfileUsers() {
        return this.getProfileAll()
    }
    getLeaveUsers() {
        return this.getLeave()
    }

  
    saveLog(category: string, userId: string, leaveId: string, comment: string) {
        var time = new Date();
        const datetime = time.toString()
        return this.saveLogUser(category, userId, leaveId, comment, datetime)
    }






}