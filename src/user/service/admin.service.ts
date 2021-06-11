
import { LoginDto } from "../dto/login.dto";
import { UserDto } from "../dto/user.dto";
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

    createAdmin() {
        const id = Math.floor(Math.random() * 10000) + 1;
        const json = `{  "firstName":"admin" ,
                        "lastName":"admin" ,
                        "email":"admin@admin.com",
                        "password":"admin1234",
                        "staffId":"${id}",
                        "phone":"",
                        "position" :"AdminExecutive​",
                        "department":"",
                        "startingDate":"",
                        "pin":"123456"
          }`;
        const admin = JSON.parse(json);
        return this.create(admin)
    }


    async createUser(userDto: UserDto, data: any) {
        try {
            const user = await this.findidUser(data['id']);
            const role = user.userP[0].position
            const roleUser = this.checkroleUser(role);
            if (roleUser == enumRoleUser.admin) {
                const user = await this.addUser(userDto);
                var time = new Date();
                const datetime = time.toString()
                await this.saveLogUser("Add User", user.id.toString(), "", `Add user ,name  ${userDto.firstName} ${userDto.lastName}`, datetime)
                return { message: user.message }
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
    editUser(userProfileDto: UserProfileDto) {
        return this.editUserProfile(userProfileDto)
    }

    async editPin(data: any, pinDto: PinDto) {
        const userId = data['id'];
        return this.editUserPin(userId, pinDto)
    }

    async deleteUser(deleteDto: DeleteDto,userId:string) {
        const user = await this.findidUser(userId);
        const role = user.userP[0].position
        const roleUser = this.checkroleUser(role)
        if (roleUser == enumRoleUser.admin) {
            var time = new Date();
            const datetime = time.toString()
            const user = await this.getProfile(deleteDto.userId)
            const result = this.saveLogUser("Delete User", userId, "", `delete user ,name  ${user.message.name}` ,datetime)
            return this.delUser(+deleteDto.userId)
        }
        else {
            return { message: "you are not admin" }
        }
        
    }

    addLeave(leaveDto: LeaveDto, res: any) {

        return this.addLeaveUser(leaveDto, res)
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

    getuser(res: any) {
        return this.getUser(res)
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