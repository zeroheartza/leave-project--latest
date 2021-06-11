import { getConnection, getManager } from "typeorm"
import { UserDto } from "../dto/user.dto"
import { tbUser } from "../entities/tbUser.entity"
import { tbLog } from "../entities/tbLog.entity"
import { tbUserProfile } from "../entities/tbUserProfile"
import * as bcrypt from 'bcrypt';
import { HttpStatus } from "@nestjs/common";
import { Response, Request, response } from 'express';
import { Not, MoreThan, Equal } from "typeorm";
import { LoginDto } from "../dto/login.dto";
import { LeaveDto } from "../dto/leave.dto";
import { LogDto } from "../dto/log.dto";
import { UserProfileDto } from "../dto/userProfile.dto";
import { enumRoleUser } from "../../core/enum";
import { PinDto } from "../dto/pin.dto";
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { tbLeave } from "../entities/tbLeave.entity"
import { notContains } from "class-validator"
import { JwtService } from "@nestjs/jwt";
import { LeaveStaffDto } from "../dto/leaveStaff.dto";
export class UserService {
    constructor() { }

    // **************** Create *********************


    async addLeaveUser(leaveDto: LeaveDto, res: any) {
        let user = new tbLeave()
        console.log(leaveDto)
        user.name = leaveDto.name
        user.staffId = leaveDto.staffId
        user.position = leaveDto.position
        user.department = leaveDto.department
        user.location = leaveDto.location
        user.phone = leaveDto.phone
        user.typeLeave = leaveDto.typeLeave
        user.startDate = leaveDto.startDate
        user.endDate = leaveDto.endDate
        user.total = leaveDto.total
        user.reason = leaveDto.reason
        user.date = leaveDto.date
        user.status = leaveDto.status
        user.reasonAdmin = leaveDto.reasonAdmin
        user.dateApproved = leaveDto.dateApproved
        user.record = leaveDto.record
        user.comment = leaveDto.comment
        user.pin = leaveDto.pin
        user = await getConnection().getRepository(tbLeave).save(user)
        return user



    }


    async addLeaveUserStaff(leaveStaffDto: LeaveStaffDto) {
        var time = new Date();
        const datetime = time.toString()
        let user = new tbLeave()
        console.log(leaveStaffDto)
        user.name = leaveStaffDto.name
        user.staffId = leaveStaffDto.staffId
        user.position = leaveStaffDto.position
        user.department = leaveStaffDto.department
        user.location = leaveStaffDto.location
        user.phone = leaveStaffDto.phone
        user.typeLeave = leaveStaffDto.typeLeave
        user.startDate = leaveStaffDto.startDate
        user.endDate = leaveStaffDto.endDate
        user.total = leaveStaffDto.total
        user.reason = leaveStaffDto.reason
        user.date = datetime
        user.status = leaveStaffDto.status
        user.reasonAdmin = ""
        user.dateApproved = ""
        user.record = ""
        user.comment = ""
        user.pin = leaveStaffDto.pin
        const userP = await getConnection().getRepository(tbUserProfile).findOne({ where: { staffId: leaveStaffDto.staffId } })
        if (userP.pin === leaveStaffDto.pin) {
            user = await getConnection().getRepository(tbLeave).save(user)
            return { message: "Submit success" }
        }
        else {
            return { message: "Pin is wrong" }
        }
    }

    async addUser(userDto: UserDto) {
        console.log(userDto)
        console.log(userDto.startingDate)
        const result1 = await getConnection().getRepository(tbUser).find({ where: { email: userDto.email } })
        const result2 = await getConnection().getRepository(tbUserProfile).find({ where: { staffId: userDto.staffId } })
        const result3 = await getConnection().getRepository(tbUserProfile).find({ where: { firstName: userDto.firstName } })
        const result4 = await getConnection().getRepository(tbUserProfile).find({ where: { phone: userDto.phone } })
        if (result1.length === 0) {
            if (result2.length === 0) {
                if (result3.length !== 0) {

                    if (result3[0].lastName == userDto.lastName) {
                        return { id: "", message: "Name with used" }
                    }
                }
                if (result4.length !== 0) {
                    return { id: "", message: "Phone with used" }
                }
                const dateP = new Date(userDto.startingDate.slice(0, 10));
                const date = new Date(new Date());
                const dateShort = new Date(date.toLocaleDateString());
                const diffTime = Math.abs(dateShort.getTime() - dateP.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                let user = new tbUser()
                let userP = new tbUserProfile()
                const hashedPassword = await bcrypt.hash(userDto.password, 12)
                user.email = userDto.email
                user.password = hashedPassword
                user = await getConnection().getRepository(tbUser).save(user)
                userP.firstName = userDto.firstName
                userP.lastName = userDto.lastName
                userP.staffId = userDto.staffId
                userP.phone = userDto.phone
                userP.position = userDto.position
                userP.department = userDto.department
                userP.startingDate = userDto.startingDate
                userP.pin = ""
                userP.sickLeave = 30
                userP.personalLeave = 4
                userP.userId = user.userId

                if (diffDays >= 365 * 2) {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 14)
                    userP.vacationLeave = vacationLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add User Success" }

                }

                else if (diffDays >= 365 * 1) {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 10)
                    userP.vacationLeave = vacationLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add User Success" }

                }

                else {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 7)
                    userP.vacationLeave = vacationLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add User Success" }
                }
            }
            else {
                return { id: "", message: "StaffID is used" }

            }
        }
        else {
            return { id: "", message: "Email is used" }
        }


    }


    async saveLogUser(category: string, userId: string, leaveId: string, comment: string, time: string) {
        let user = new tbLog()
        user.category = category
        user.userId = userId
        user.leaveId = leaveId
        user.comment = comment
        user.time = time
        user = await getConnection().getRepository(tbLog).save(user)
        return
    }


    async create(admin: any) {
 
        const result = await getConnection().getRepository(tbUser).find({ where: { email: admin.email } })
        if (result.length === 0) {
            let user = new tbUser()
            let userP = new tbUserProfile()
            user.email = admin.email
            const hashedPassword = await bcrypt.hash(admin.password, 12)
            user.password = hashedPassword
            userP.staffId = admin.staffId
            userP.firstName = admin.firstName
            userP.lastName = admin.lastName
            userP.phone = admin.phone
            userP.position = admin.position
            userP.department = admin.department
            userP.startingDate = admin.startingDate
            userP.pin = admin.pin
            userP.personalLeave = 0
            userP.vacationLeave = 0
            userP.sickLeave = 0
            user = await getConnection().getRepository(tbUser).save(user)
            userP.userId = user.userId
            userP = await getConnection().getRepository(tbUserProfile).save(userP)
            console.log('result', user, userP)
            return { user, userP }
        }
        else {
            console.log('result', 'Email is in use')
            return result
        }
    }


    // **************** Read *********************


    async findidUser(id: string) {
        const user = await getConnection().getRepository(tbUser).find({ where: { userId: id } })
        const userP = await getConnection().getRepository(tbUserProfile).find({ where: { userId: id } })
        return { user, userP }
    }

    async findidLeave(id: string) {
        const user = await getConnection().getRepository(tbLeave).find({ where: { staffId: id } })
        var Arr = [];
        user.map((x, i) => {
            Arr.push({
                "number": i,
                "leaveId": x.leaveId,
                "category": x.typeLeave,
                "total": x.total,
                "status": x.status,
                "date": x.date
            })
        });
        return Arr

    }

    async findOneidLeave(id: string, leaveId: string) {
        const user = await getConnection().getRepository(tbLeave).findOne({ where: { staffId: id, leaveId: leaveId } })
        return user
    }


    async findLogId(id: string) {
        const user = await getConnection().getRepository(tbLog).find({ where: { userId: id } })
        console.log(user)
        return { user }
    }

    async findLogAll() {
        const user = await getManager().createQueryBuilder(tbLog, 't1')
            .select('t1.category', 'category')
            .addSelect('t1.comment', 'status')
            .addSelect('t1.leaveId', 'leaveId')
            .addSelect('t1.time', 'date')
            .addSelect('t2.firstName', 'firstName')
            .addSelect('t2.lastName', 'lastName')
            .addSelect('t2.department', 'department')
            .addSelect('t2.position', 'position')
            .innerJoin(tbUserProfile, 't2', 't1.userId = t2.userId').getRawMany()
        var Arr = [];
        user.map((x, i) => {
            Arr.push({
                "number": i,
                "leaveId": x.leaveId,
                "category": x.category,
                "name": x.firstName + " " + x.lastName,
                "department": x.department,
                "position": x.position,
                "status": x.status,
                "date": x.date
            })
        });
        console.log(Arr)
        return { Arr }
    }

    async getUser(res: any) {


        const result = await getConnection().getRepository(tbUser).find()
        // console.log(result[0].password)
        console.log(result)
        return res.status(HttpStatus.OK).json({ message: result })



    }
    async updateDate() {
        const result = await getConnection().getRepository(tbUserProfile).find({ "position": Not(Equal("Administrator")) })

        var Arr = [];
        for (let i = 0; i < result.length; i++) {

            const dateP = new Date(result[i].startingDate.slice(0, 10));
            const date = new Date(new Date());
            const dateShort = new Date(date.toLocaleDateString());
            const diffTime = Math.abs(dateShort.getTime() - dateP.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (Math.floor(diffDays / 365) == diffDays / 365) {

                if (result[i].vacationLeave > 4) {
                    let userP = new tbUserProfile()
                    userP.staffId = result[i].staffId
                    userP.vacationLeave = result[i].vacationLeave + 4
                    userP.profileId = result[i].profileId
                    userP.firstName = result[i].firstName
                    userP.lastName = result[i].lastName
                    userP.staffId = result[i].staffId
                    userP.phone = result[i].phone
                    userP.position = result[i].position
                    userP.department = result[i].department
                    userP.startingDate = result[i].startingDate
                    userP.userId = result[i].userId
                    userP.pin = result[i].pin
                    userP.sickLeave = result[i].sickLeave
                    userP.personalLeave = result[i].personalLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)

                }
            }


            if (diffDays >= 365 * 2) {
                const day = diffDays - (365 * Math.floor(diffDays / 365))
                const day1 = (diffDays - 1) - ((365) * Math.floor((diffDays - 1) / 365))
                const vacationLeave = Math.floor((day / 365) * 14)
                const checkday = Math.floor(((day1) / 365) * 14)
                if (vacationLeave != checkday) {
                    let userP = new tbUserProfile()
                    userP.staffId = result[i].staffId
                    userP.vacationLeave = result[i].vacationLeave + 1
                    userP.profileId = result[i].profileId
                    userP.firstName = result[i].firstName
                    userP.lastName = result[i].lastName
                    userP.staffId = result[i].staffId
                    userP.phone = result[i].phone
                    userP.position = result[i].position
                    userP.department = result[i].department
                    userP.startingDate = result[i].startingDate
                    userP.userId = result[i].userId
                    userP.pin = result[i].pin
                    userP.sickLeave = result[i].sickLeave
                    userP.personalLeave = result[i].personalLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)

                }
            }
            else if (diffDays >= 365 * 1) {

                const day = diffDays - (365 * Math.floor(diffDays / 365))
                const day1 = (diffDays - 1) - ((365) * Math.floor((diffDays - 1) / 365))
                const vacationLeave = Math.floor((day / 365) * 10)
                const checkday = Math.floor(((day1) / 365) * 10)
                if (vacationLeave != checkday) {
                    let userP = new tbUserProfile()
                    userP.staffId = result[i].staffId
                    userP.vacationLeave = result[i].vacationLeave + 1
                    userP.profileId = result[i].profileId
                    userP.firstName = result[i].firstName
                    userP.lastName = result[i].lastName
                    userP.staffId = result[i].staffId
                    userP.phone = result[i].phone
                    userP.position = result[i].position
                    userP.department = result[i].department
                    userP.startingDate = result[i].startingDate
                    userP.userId = result[i].userId
                    userP.pin = result[i].pin
                    userP.sickLeave = result[i].sickLeave
                    userP.personalLeave = result[i].personalLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)

                }
            }
            else {
                const day = diffDays - (365 * Math.floor(diffDays / 365))
                const day1 = (diffDays - 1) - ((365) * Math.floor((diffDays - 1) / 365))
                const vacationLeave = Math.floor((day / 365) * 7)
                const checkday = Math.floor(((day1) / 365) * 7)
                if (vacationLeave != checkday) {
                    let userP = new tbUserProfile()
                    userP.staffId = result[i].staffId
                    userP.vacationLeave = result[i].vacationLeave + 1
                    userP.profileId = result[i].profileId
                    userP.firstName = result[i].firstName
                    userP.lastName = result[i].lastName
                    userP.staffId = result[i].staffId
                    userP.phone = result[i].phone
                    userP.position = result[i].position
                    userP.department = result[i].department
                    userP.startingDate = result[i].startingDate
                    userP.userId = result[i].userId
                    userP.pin = result[i].pin
                    userP.sickLeave = result[i].sickLeave
                    userP.personalLeave = result[i].personalLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)
                }
            }
        }
    }


    async getProfileAll() {
        const result = await getConnection().getRepository(tbUserProfile).find({ "position": Not(Equal("Administrator")) })
        var Arr = [];
        for (let i = 0; i < result.length; i++) {
            Arr.push({
                "number": i,
                "userId": result[i].userId,
                "staffId": result[i].staffId,
                "name": result[i].firstName + " " + result[i].lastName,
                "firstName": result[i].firstName, "lastName": result[i].lastName,
                "department": result[i].department, "position": result[i].position,
                "phone": result[i].phone,
                "startingDate": result[0].startingDate
            })
        }
        return { message: Arr }

    }

    async getProfile(userId: string) {
        const result = await getConnection().getRepository(tbUserProfile).findOne(
            {
                userId: (Equal(+userId)),
                position: Not(Equal("Administrator"))
            }
        )
        return {
            message: {
                "userId": result.userId, "staffId": result.staffId,
                "name": result.firstName + " " + result.lastName,
                "department": result.department,
                "position": result.position,
                "phone": result.phone,
                "sickLeave": result.sickLeave,
                "personalLeave": result.personalLeave,
                "vacationLeave": result.vacationLeave
            }
        }
    }



    getUserWhereId(id: string) {
        const result = getConnection().getRepository(tbUser).findOne({ where: { userId: id } })
        return result
    }


    async getLeave() {
        const result = await getConnection().getRepository(tbLeave).find()
        var Arr = [];
        result.map((x, i) => {
            Arr.push({
                "number": i,
                "leaveId": x.leaveId,
                "name": x.name, "department": x.department,
                "position": x.position, "status": x.status,
                "date": x.date
            })
        });
        return { message: Arr }
    }


    async findemailUser(loginDto: LoginDto) {
        const result = await getConnection().getRepository(tbUser).find({ where: { email: loginDto.email } })
        if (result.length === 0) {
            return { id: "", message: "Invalid email" }
        }
        else {
            if (!await bcrypt.compare(loginDto.password, result[0].password)) {
                return { id: result[0].userId.toString(), message: "Incorrect password" }
            }
            else {

                return { id: result[0].userId.toString(), message: "Login Success" }
            }
        }
    }

    async getLookUp() {
        const data =
        {
            "Position": ["Chairman",
                "Honorary Board",
                "Chief Executive Officer​",
                "Chief Business Officer​",
                "Territorial Business Lead​",
                "Social Innovation Associates​​",
                "Business Investment Associates​​",
                "Financial Investment Associates​",
                "Chief Technical Officer​",
                "Innovation Lead",
                "Innovation Associates​",
                "UX/UI Lead​",
                "UX",
                "UI / Graphics",
                "Graphics​",
                "Development Lead​",
                "Front End Developer​",
                "Back End Developer",
                "Cloud Infra Engineer",
                "Security Engineer​​",
                "Chief Marketing Officer​​",
                "PR​",
                "Content Writer​​",
                "Graphic Designer / Animator​​​",
                "Event Co-Ordinator​​",
                "Digital Marketing ​",
                "Video Editor",
                "Videographer / Photographer​",
                "Chief Legal Officer​​",
                "Legal Executive​",
                "Chief Compliance Officer​",
                "Compliance Executive​​",
                "Chief Finance Officer",
                "Admin, HR and Operation Manager​",
                "Admin Executive​",
                "HR Executive​",
                "Admin & HR​ ​",
                "Finance Manager​​",
                "Finance Exec​​​"

            ],
            "Department": ["Business Team",
                "Developer Team",
                "Operation Team",
                "Marketing Team",
                "Innovation Team",
                "-"
            ]
        }
        return data
    }

    async getTypeLeave() {
        const data =
        {
            "Type": ["ลาป่วย / Sick leave",
                "ลาพักร้อน / Annual leave",
                "ลากิจ / Business leave",
                "ลาโดยไม่รับค้าจ้าง / Leave without pay",
                "ลาหยุดทดแทน / Off in lieu",
                "อื่นๆ (ระบุ) / Others"
            ]
        }
        return data
    }

    checkroleUser(role: string) {
        var roleStaff = ["Chairman",
        "Honorary Board",
        "Chief Executive Officer​",
        "Chief Business Officer​",
        "Territorial Business Lead​",
        "Social Innovation Associates​​",
        "Business Investment Associates​​",
        "Financial Investment Associates​",
        "Chief Technical Officer​",
        "Innovation Lead",
        "Innovation Associates​",
        "UX/UI Lead​",
        "UX",
        "UI / Graphics",
        "Graphics​",
        "Development Lead​",
        "Front End Developer​",
        "Back End Developer",
        "Cloud Infra Engineer",
        "Security Engineer​​",
        "Chief Marketing Officer​​",
        "PR​",
        "Content Writer​​",
        "Graphic Designer / Animator​​​",
        "Event Co-Ordinator​​",
        "Digital Marketing ​",
        "Video Editor",
        "Videographer / Photographer​",
        "Chief Legal Officer​​",
        "Legal Executive​",
        "Chief Compliance Officer​",
        "Compliance Executive​​",
        "Chief Finance Officer",
        "Admin, HR and Operation Manager​",
        "Admin Executive​",
        "HR Executive​",
        "Admin & HR​ ​",
        "Finance Manager​​",
        "Finance Exec​​​"]

        var roleSuper = [ "Development Lead​","Territorial Business Lead​","UX/UI Lead​"]
        var roleHr = ["HR Executive​"]
        var roleAdmin = ["Admin & HR​ ​","AdminExecutive​","Admin, HR and Operation Manager​"]
        if (roleStaff.includes(role)) {
            const roleUser = enumRoleUser.staff
            return roleUser
        }
        if (roleSuper.includes(role)) {
            const roleUser = enumRoleUser.super
            return roleUser
        }
        if (roleHr.includes(role)) {
            const roleUser = enumRoleUser.HR
            return roleUser
        }
        if (roleAdmin.includes(role)) {
            const roleUser = enumRoleUser.admin
            return roleUser
        }
    }



    // **************** Update *********************



    async editUserProfile(userProfileDto: UserProfileDto) {
        const num = +userProfileDto.userId
        console.log(userProfileDto.userId)
        const checkStaffId = await getConnection().getRepository(tbUserProfile).find({
            userId: Not(Equal(num)),
            staffId: (Equal(userProfileDto.staffId))
        })
        const checkName = await getConnection().getRepository(tbUserProfile).find({
            userId: Not(Equal(num)),
            firstName: (Equal(userProfileDto.firstName)),
            lastName: (Equal(userProfileDto.lastName))
        })
        const checkPhone = await getConnection().getRepository(tbUserProfile).find({
            userId: Not(Equal(num)),
            phone: (Equal(userProfileDto.phone))
        })

        if (checkStaffId.length === 0) {
            if (checkName.length === 0) {
                if (checkPhone.length === 0) {
                    const user = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: userProfileDto.userId } })
                    let userP = new tbUserProfile()
                    userP.profileId = user.profileId
                    userP.firstName = userProfileDto.firstName
                    userP.lastName = userProfileDto.lastName
                    userP.staffId = userProfileDto.staffId
                    userP.phone = userProfileDto.phone
                    userP.position = userProfileDto.position
                    userP.department = userProfileDto.department
                    userP.startingDate = user.startingDate
                    userP.userId = user.userId
                    userP.pin = user.pin
                    userP.vacationLeave = user.vacationLeave
                    userP.sickLeave = user.sickLeave
                    userP.personalLeave = user.personalLeave
                    const result = await getConnection().getRepository(tbUserProfile).save(userP)
                    return { message: "Edit profile Success" }
                }
                else {
                    return { message: "Phone number is used" }
                }
            }
            else {
                return { message: "Name is used" }
            }
        }
        else {
            return { message: "StaffID is used" }
        }
    }


    async editUserPin(userId: string, pinDto: PinDto) {
        const user = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: userId } })
        let userP = new tbUserProfile()
        userP.profileId = user.profileId
        userP.firstName = user.firstName
        userP.lastName = user.lastName
        userP.staffId = user.staffId
        userP.phone = user.phone
        userP.position = user.position
        userP.department = user.department
        userP.startingDate = user.startingDate
        userP.userId = +userId
        userP.pin = pinDto.pin
        await getConnection().getRepository(tbUserProfile).save(userP)
        return { message: "Edit pin Success" }
    }


    // **************** Delete *********************


    async delUser(userId: number) {
        const userp = await getConnection().getRepository(tbUserProfile).find({ where: { userId: userId } })
        await getConnection().getRepository(tbUserProfile).delete(userp[0].profileId)
        await getConnection().getRepository(tbUser).delete(userId)
        return { message: "Delete Success" }

    }
}