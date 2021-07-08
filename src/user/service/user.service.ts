import { getConnection, getManager } from "typeorm"
import { UserDto } from "../dto/user.dto"
import { ChangePinDto } from "../dto/changepin.dto";
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
import { AdminDto } from "../dto/admin.dto";
import { UserProfileDto } from "../dto/userProfile.dto";
import { EditUserProfileDto } from "../dto/edituserProfile.dto";
import { enumRoleUser } from "../../core/enum";
import { PinDto } from "../dto/pin.dto";
import { ApproveDto } from "../dto/approve.dto";
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { tbLeave } from "../entities/tbLeave.entity"
import { RecordDto } from "../dto/record.dto";
import { PasswordDto } from "../dto/password.dto";
import { notContains } from "class-validator"
import { JwtService } from "@nestjs/jwt";
import { LeaveStaffDto } from "../dto/leaveStaff.dto";
export class UserService {
    constructor() { }

    // **************** Create *********************


    async addLeaveUser(userId: string, leaveDto: LeaveDto) {
        const userProfile = await getConnection().getRepository(tbUserProfile).findOne({ where: { staffId: leaveDto.staffId } })
        const userHR = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: userId } })
        var time = new Date();
        const datetime = time.toString()
    
        if (await bcrypt.compare(leaveDto.pin, userHR.pin )) {
            let user = new tbLeave()

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
            user.date = datetime
            user.dateRecord = datetime
            user.status = "อนุมัติเรียบร้อย"
            user.statusHR = "ลงบันทึกเรียบร้อย"
            user.reasonSuper = leaveDto.reasonSuper
            user.dateApproved = datetime
            user.record = leaveDto.record
            user.comment = leaveDto.comment
            const numTotal = +user.total
            const numVacationLeave = parseInt(userProfile.vacationLeave)
            const numSickLeave = parseInt(userProfile.sickLeave)
            const numPersonalLeave = parseInt(userProfile.personalLeave)
            let userP = new tbUserProfile()
      
            if (user.typeLeave == "ลาป่วย") {
                userP.profileId = userProfile.profileId
                userP.firstName = userProfile.firstName
                userP.lastName = userProfile.lastName
                userP.staffId = userProfile.staffId
                userP.phone = userProfile.phone
                userP.position = userProfile.position
                userP.department = userProfile.department
                userP.startingDate = userProfile.startingDate
                userP.userId = userProfile.userId
                userP.pin = userProfile.pin
                userP.vacationLeave = userProfile.vacationLeave
                userP.sickLeave = (numSickLeave - numTotal).toString()
                userP.personalLeave = userProfile.personalLeave
                await getConnection().getRepository(tbUserProfile).save(userP)
                await getConnection().getRepository(tbLeave).save(user)
                return { message: "Submit success" }
                // } else {
                //     return { message: "The rest of the days are not enough" }
                // }
            }
            if (user.typeLeave == "ลาพักร้อน") {
                // if (numVacationLeave - numTotal >= 0) {
                userP.profileId = userProfile.profileId
                userP.firstName = userProfile.firstName
                userP.lastName = userProfile.lastName
                userP.staffId = userProfile.staffId
                userP.phone = userProfile.phone
                userP.position = userProfile.position
                userP.department = userProfile.department
                userP.startingDate = userProfile.startingDate
                userP.userId = userProfile.userId
                userP.pin = userProfile.pin
                userP.vacationLeave = (numVacationLeave - numTotal).toString()
                userP.sickLeave = userProfile.sickLeave
                userP.personalLeave = userProfile.personalLeave
                await getConnection().getRepository(tbUserProfile).save(userP)
                await getConnection().getRepository(tbLeave).save(user)
                return { message: "Submit success" }
                // }
                // else {
                //     return { message: "The rest of the days are not enough" }
                // }
            }
            if (user.typeLeave == "ลากิจ") {
                // if (numPersonalLeave - numTotal >= 0) {
                userP.profileId = userProfile.profileId
                userP.firstName = userProfile.firstName
                userP.lastName = userProfile.lastName
                userP.staffId = userProfile.staffId
                userP.phone = userProfile.phone
                userP.position = userProfile.position
                userP.department = userProfile.department
                userP.startingDate = userProfile.startingDate
                userP.userId = userProfile.userId
                userP.pin = userProfile.pin
                userP.vacationLeave = userProfile.vacationLeave
                userP.sickLeave = userProfile.sickLeave
                userP.personalLeave = (numPersonalLeave - numTotal).toString()
                await getConnection().getRepository(tbUserProfile).save(userP)
                await getConnection().getRepository(tbLeave).save(user)
                return { message: "Submit success" }
                // }
                // else {
                //     return { message: "The rest of the days are not enough" }
                // }
            }
            else {

                await getConnection().getRepository(tbLeave).save(user)
                return { message: "Submit success" }
            }
        }
        else {
            return { message: "Pin is wrong" }
        }





    }


    async addLeaveUserStaff(leaveStaffDto: LeaveStaffDto) {
        var time = new Date();
        const datetime = time.toString()
        let user = new tbLeave()

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
        user.statusHR = ""
        user.reasonSuper = ""
        user.dateApproved = ""
        user.dateRecord = ""
        user.record = ""
        user.comment = ""
        const leave = await getConnection().getRepository(tbLeave).find({ where: { staffId: leaveStaffDto.staffId, status: "รอการอนุมัติ" } })

        let countVacationLeave = 0
        let countPersonalLeave = 0
        let countSickLeave = 0
        leave.map((x, i) => {
            if (x.typeLeave == "ลาป่วย") {
                const numTotal = +x.total
                countSickLeave += numTotal
            }
            else if (x.typeLeave == "ลาพักร้อน") {
                const numTotal = +x.total
                countVacationLeave += numTotal
            }
            else if (x.typeLeave == "ลากิจ") {
                const numTotal = +x.total
                countPersonalLeave += numTotal
            }

        })


        const userP = await getConnection().getRepository(tbUserProfile).findOne({ where: { staffId: leaveStaffDto.staffId } })

        // if (await bcrypt.compare(userP.pin, leaveStaffDto.pin)) {
        if (await bcrypt.compare(leaveStaffDto.pin, userP.pin)) {

            if (user.typeLeave == "ลาป่วย") {
                const numTotal = + leaveStaffDto.total

                let numSickLeave = parseInt(userP.sickLeave)
                if ((numSickLeave - (countSickLeave + numTotal)) >= 0) {
                    user = await getConnection().getRepository(tbLeave).save(user)
                    return { userId: userP.userId, date: datetime, leaveId: user.leaveId, message: "Submit success" }
                }
                else {
                    return { message: "The rest of the days are not enough" }
                }
            }


            else if (user.typeLeave == "ลาพักร้อน") {
                const numTotal = + leaveStaffDto.total
                let numVacationLeave = parseInt(userP.vacationLeave);
                if ((numVacationLeave - (countVacationLeave + numTotal)) >= 0) {
                    user = await getConnection().getRepository(tbLeave).save(user)
                    return { userId: userP.userId, date: datetime, leaveId: user.leaveId, message: "Submit success" }
                }
                else {
                    return { message: "The rest of the days are not enough" }
                }

            }
            else if (user.typeLeave == "ลากิจ") {
                const numTotal = + leaveStaffDto.total
                const numPersonalLeave = parseInt(userP.personalLeave)
                if ((numPersonalLeave - (countVacationLeave + numTotal)) >= 0) {
                    user = await getConnection().getRepository(tbLeave).save(user)
                    return { userId: userP.userId, date: datetime, leaveId: user.leaveId, message: "Submit success" }
                }
                else {
                    return { message: "The rest of the days are not enough" }
                }

            }


        }
        else {
            return { userId: userP.userId, date: datetime, leaveId: user.leaveId, message: "Pin is wrong" }
        }
    }

    async addUser(userDto: UserDto) {
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
                userP.firstName = userDto.firstName[0].toUpperCase() + userDto.firstName.slice(1, userDto.firstName.length).toLowerCase(),
                    userP.lastName = userDto.lastName[0].toUpperCase() + userDto.lastName.slice(1, userDto.lastName.length).toLowerCase(),
                    userP.staffId = userDto.staffId
                userP.phone = userDto.phone
                userP.position = userDto.position
                userP.department = userDto.department
                userP.startingDate = userDto.startingDate
                userP.pin = ""
                userP.sickLeave = userDto.sickLeave
                userP.personalLeave = userDto.businessLeave
                userP.userId = user.userId
                const num = +userDto.annualLeave
                if (diffDays >= 365 * 2) {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 14)
                    userP.vacationLeave = (vacationLeave + num).toString()
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add User Success" }

                }

                else if (diffDays >= 365 * 1) {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 10)
                    userP.vacationLeave = (vacationLeave + num).toString()
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add User Success" }

                }

                else {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 7)
                    userP.vacationLeave = (vacationLeave + num).toString()
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add User Success" }
                }


            } else {
                return { id: "", message: "StaffID is used" }

            }

        } else {
            return { id: "", message: "Email is used" }
        }

    }


    async addAdmin(adminDto: AdminDto) {
        const result1 = await getConnection().getRepository(tbUser).find({ where: { email: adminDto.email } })
        const result2 = await getConnection().getRepository(tbUserProfile).find({ where: { staffId: adminDto.staffId } })
        const result3 = await getConnection().getRepository(tbUserProfile).find({ where: { firstName: adminDto.firstName } })
        const result4 = await getConnection().getRepository(tbUserProfile).find({ where: { phone: adminDto.phone } })
        if (result1.length === 0) {
            if (result2.length === 0) {
                if (result3.length !== 0) {

                    if (result3[0].lastName == adminDto.lastName) {
                        return { id: "", message: "Name with used" }
                    }
                }

                if (result4.length !== 0) {
                    return { id: "", message: "Phone with used" }
                }

                const dateP = new Date(adminDto.startingDate.slice(0, 10));
                const date = new Date(new Date());
                const dateShort = new Date(date.toLocaleDateString());
                const diffTime = Math.abs(dateShort.getTime() - dateP.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let user = new tbUser()
                let userP = new tbUserProfile()
                const hashedPassword = await bcrypt.hash(adminDto.password, 12)
                user.email = adminDto.email
                user.password = hashedPassword
                user = await getConnection().getRepository(tbUser).save(user)
                userP.firstName = adminDto.firstName[0].toUpperCase() + adminDto.firstName.slice(1, adminDto.firstName.length).toLowerCase(),
                    userP.lastName = adminDto.lastName[0].toUpperCase() + adminDto.lastName.slice(1, adminDto.lastName.length).toLowerCase(),
                    userP.staffId = adminDto.staffId
                userP.phone = adminDto.phone
                userP.position = "Admin Executive​"
                userP.department = "Finance Team"
                userP.startingDate = adminDto.startingDate
                userP.pin = ""
                userP.sickLeave = adminDto.sickLeave
                userP.personalLeave = adminDto.businessLeave
                userP.userId = user.userId

                const num = +adminDto.annualLeave
                if (diffDays >= 365 * 2) {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 14)
                    userP.vacationLeave = (vacationLeave + num).toString()
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add Admin Success" }

                }

                else if (diffDays >= 365 * 1) {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 10)
                    userP.vacationLeave = (vacationLeave + num).toString()
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add Admin Success" }

                }

                else {
                    const day = diffDays - (365 * Math.floor(diffDays / 365))
                    const vacationLeave = Math.floor((day / 365) * 7)
                    userP.vacationLeave = (vacationLeave + num).toString()
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { id: user.userId, message: "Add Admin Success" }
                }




            } else {
                return { id: "", message: "StaffID is used" }

            }

        } else {
            return { id: "", message: "Email is used" }
        }

    }




    async saveLogUser(category: string, userId: string, status: string, comment: string, time: string) {
        let user = new tbLog()
        user.category = category
        user.userId = userId
        user.status = status
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
            // const hashedPin = await bcrypt.hash(admin.pin, 12)
            userP.pin = admin.pin
            userP.personalLeave = "0"
            userP.vacationLeave = "0"
            userP.sickLeave = "0"
            user = await getConnection().getRepository(tbUser).save(user)
            userP.userId = user.userId
            userP = await getConnection().getRepository(tbUserProfile).save(userP)
            return { user, userP }
        }
        else {
            return result
        }
    }


    async editPassword(userId: string, passwordDto: PasswordDto) {

        const result = await getConnection().getRepository(tbUser).findOne({ where: { userId: userId } })
        if (await bcrypt.compare(passwordDto.oldPassword, result.password)) {
            let user = new tbUser()
            user.userId = result.userId
            user.email = result.email
            const hashedPassword = await bcrypt.hash(passwordDto.newPassword, 12)
            user.password = hashedPassword
            user = await getConnection().getRepository(tbUser).save(user)
            return { message: "Successful password change" }
        }
        else {
            return { message: "Change password failed" }
        }
    }


    async forgetPasswordUser(email: string, newpassword: string) {

        const result = await getConnection().getRepository(tbUser).findOne({ where: { email: email } })

        let user = new tbUser()
        user.userId = result.userId
        user.email = result.email
        const hashedPassword = await bcrypt.hash(newpassword, 12)
        user.password = hashedPassword
        user = await getConnection().getRepository(tbUser).save(user)

        return { message: "Successful password change" }

    }

    async forgetPinUser(userId: string, newPin: string) {

        const result = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: userId } })






        let userP = new tbUserProfile()
        userP.staffId = result.staffId
        userP.vacationLeave = result.vacationLeave
        userP.profileId = result.profileId
        userP.firstName = result.firstName
        userP.lastName = result.lastName
        userP.staffId = result.staffId
        userP.phone = result.phone
        userP.position = result.position
        userP.department = result.department
        userP.startingDate = result.startingDate
        userP.userId = result.userId
        // const hashedPin = await bcrypt.hash(changePinDto.newPin, 12)
        const hashedPin = await bcrypt.hash(newPin, 12)
        userP.pin = hashedPin
        userP.sickLeave = result.sickLeave
        userP.personalLeave = result.personalLeave
        // const hashedPassword = await bcrypt.hash(changePinDto.newPin, 12)
        // user.password = hashedPassword

        await getConnection().getRepository(tbUserProfile).save(userP)
      
        return { message: "Successful pin change" }




    }


    async editPin(userId: string, changePinDto: ChangePinDto) {

        const result = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: userId } })
        if (await bcrypt.compare(changePinDto.oldPin, result.pin)) {
            // if (changePinDto.oldPin == result.pin) {
            let userP = new tbUserProfile()
            userP.staffId = result.staffId
            userP.vacationLeave = result.vacationLeave
            userP.profileId = result.profileId
            userP.firstName = result.firstName
            userP.lastName = result.lastName
            userP.staffId = result.staffId
            userP.phone = result.phone
            userP.position = result.position
            userP.department = result.department
            userP.startingDate = result.startingDate
            userP.userId = result.userId
            const hashedPin = await bcrypt.hash(changePinDto.newPin, 12)
            userP.pin = hashedPin
            userP.sickLeave = result.sickLeave
            userP.personalLeave = result.personalLeave
            await getConnection().getRepository(tbUserProfile).save(userP)
            return { message: "Successful pin change" }
        }
        else {
            return { message: "Change pin failed" }
        }
    }


    // **************** Read *********************


    async findidUser(id: string) {
        const user = await getConnection().getRepository(tbUser).find({ where: { userId: id } })
        const userP = await getConnection().getRepository(tbUserProfile).find({ where: { userId: id } })
        return { user, userP }
    }

    async findideMailId(email: string) {
        const user = await getConnection().getRepository(tbUser).findOne({ where: { email: email } })
        const userP = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: user.userId } })
        return { user, userP }
    }

    async findidEmail(leaveId: string) {
        // const userL = await getConnection().getRepository(tbLeave).findOne({ where: { leaveId: id } }) 
        // const userP = await getConnection().getRepository(tbUserProfile).findOne({ where: { staffId: userL.staffId } })
        // const user = await getConnection().getRepository(tbUser).findOne({ where: { userId:   userP.userId } })

        const user = await getManager().createQueryBuilder(tbUser, 't1')
            .select('t1.email', 'email')
            .addSelect('t2.position', 'position')
            .addSelect('t2.pin', 'pin')
            .innerJoin(tbUserProfile, 't2', 't2.userId = t1.userId')
            .innerJoin(tbLeave, 't3', `t3.staffId = t2.staffId`)
            .where(`t3.leaveId = ${leaveId}`)
            .getRawMany()
        const results = JSON.parse(JSON.stringify(user[0]))
        return results
    }

    async findidLeave(id: string, position: string) {
        const user = await getConnection().getRepository(tbLeave).find({ where: { staffId: id }, order: { leaveId: "DESC" } })
        var Arr = [];
        if (position == "Chief Executive Officer​") {

            const thaiToEngStatus = ['ไม่อนุมัติ', 'อนุมัติเรียบร้อย', 'รอการอนุมัติ']
            const thaiToEngStatusHR = ['', 'ลงบันทึกเรียบร้อย', 'รอลงบันทึก']
            const thaiToEngCategory = ['ลาป่วย', 'ลาพักร้อน', 'ลากิจ', 'ลาโดยไม่รับค้าจ้าง', 'ลาหยุดทดแทน']
            const engStatus = ['Rejected', 'Approved', 'Pending approval']
            const engStatusHR = ['', 'recorded', 'Pending record']
            const engCategory = ['Sick leave', 'Annual leave', 'Business leave', 'Leave without pay', 'Off in lieu']

            user.map((x, i) => {
                const indexStatus = thaiToEngStatus.indexOf(x.status);

                x.status = engStatus[indexStatus]

                const indexCategory = thaiToEngCategory.indexOf(x.typeLeave);
                x.typeLeave = engCategory[indexCategory]

                const indexStatusHR = thaiToEngStatusHR.indexOf(x.statusHR);
                x.statusHR = engStatusHR[indexStatusHR]

            });



            user.map((x, i) => {
                if (x.status == "อนุมัติเรียบร้อย") {
                    Arr.push({
                        "number": i,
                        "leaveId": x.leaveId,
                        "category": x.typeLeave,
                        "total": x.total,
                        "status": x.status,
                        "date": x.dateApproved
                    })
                }
                else if (x.status == "ไม่อนุมัติ") {
                    Arr.push({
                        "number": i,
                        "leaveId": x.leaveId,
                        "category": x.typeLeave,
                        "total": x.total,
                        "status": x.status,
                        "date": x.dateApproved
                    })
                }
                else {
                    Arr.push({
                        "number": i,
                        "leaveId": x.leaveId,
                        "category": x.typeLeave,
                        "total": x.total,
                        "status": x.status,
                        "date": x.date
                    })
                }
            });
        } else {
            user.map((x, i) => {
                if (x.status == "อนุมัติเรียบร้อย") {
                 
                    Arr.push({
                        "number": i,
                        "leaveId": x.leaveId,
                        "category": x.typeLeave,
                        "total": x.total,
                        "status": x.status,
                        "date": x.dateApproved
                    })
                }
                else if (x.status == "ไม่อนุมัติ") {
                    
                    Arr.push({
                        "number": i,
                        "leaveId": x.leaveId,
                        "category": x.typeLeave,
                        "total": x.total,
                        "status": x.status,
                        "date": x.dateApproved
                    })
                }
                else {
                 
                    Arr.push({
                        "number": i,
                        "leaveId": x.leaveId,
                        "category": x.typeLeave,
                        "total": x.total,
                        "status": x.status,
                        "date": x.date
                    })

                }

            });




        }
        return { message: Arr }

    }

    async findOneidLeaveAdmin(position: string, leaveId: string) {
        if (position == enumRoleUser.admin) {
            const user = await getConnection().getRepository(tbLeave).findOne({ where: { leaveId: leaveId } })
            return user
        }
        else {
            return { message: "you are not admin" }
        }

    }

    async findOneidLeave(leaveId: string) {
        // const user = await getConnection().getRepository(tbLeave).findOne({ where: { staffId: id, leaveId: leaveId } })
        const user = await getConnection().getRepository(tbLeave).findOne({ where: { leaveId: leaveId } })
        return user
    }


    async getLeaveId(leaveId: string) {
        const user = await getConnection().getRepository(tbLeave).findOne({ where: { leaveId: leaveId } })
        return user
    }




    async findOneidStaffLeave(position: any, leaveId: string) {
        const user = await getConnection().getRepository(tbLeave).findOne({ where: { leaveId: leaveId } })
        const userCheck = await getConnection().getRepository(tbUserProfile).find({ "staffId": user.staffId })
        if (position.includes(user.position)) {
            if (userCheck.length !== 0) {
                return {
                    message: {
                        "leaveId": user.leaveId,
                        "name": user.name,
                        "staffId": user.staffId,
                        "position": user.position,
                        "department": user.department,
                        "location": user.location,
                        "phone": user.phone,
                        "typeLeave": user.typeLeave,
                        "reason": user.reason,
                        "date": user.date,
                        "status": user.status,
                        "reasonSuper": user.reasonSuper,
                        "dateApprove": user.dateApproved,
                        "startDate": user.startDate,
                        "endDate": user.endDate,
                        "total": user.total,
                        "statusUser": true
                    }
                }
            } else {
                return {
                    message: {
                        "leaveId": user.leaveId,
                        "name": user.name,
                        "staffId": user.staffId,
                        "position": user.position,
                        "department": user.department,
                        "location": user.location,
                        "phone": user.phone,
                        "typeLeave": user.typeLeave,
                        "reason": user.reason,
                        "date": user.date,
                        "status": user.status,
                        "reasonSuper": user.reasonSuper,
                        "dateApprove": user.dateApproved,
                        "startDate": user.startDate,
                        "endDate": user.endDate,
                        "total": user.total,
                        "statusUser": false
                    }
                }

            }
        }
    }




    async findOneidApproveLeave(position: any, leaveId: string) {
        const user = await getConnection().getRepository(tbLeave).findOne({ where: { leaveId: leaveId } })
        const userCheck = await getConnection().getRepository(tbUserProfile).find({ "staffId": user.staffId })
        if (user.status == "อนุมัติเรียบร้อย" && position == enumRoleUser.HR) {
            if (userCheck.length !== 0) {
                return {
                    message: {
                        "leaveId": user.leaveId,
                        "name": user.name,
                        "staffId": user.staffId,
                        "position": user.position,
                        "department": user.department,
                        "location": user.location,
                        "phone": user.phone,
                        "typeLeave": user.typeLeave,
                        "reason": user.reason,
                        "date": user.date,
                        "status": user.status,
                        "statusHR": user.statusHR,
                        "reasonSuper": user.reasonSuper,
                        "dateApprove": user.dateApproved,
                        "startDate": user.startDate,
                        "endDate": user.endDate,
                        "dateRecord": user.dateRecord,
                        "total": user.total,
                        "record": user.record,
                        "comment": user.comment,
                        "statusUser": true

                    }
                }
            } else {
                return {
                    message: {
                        "leaveId": user.leaveId,
                        "name": user.name,
                        "staffId": user.staffId,
                        "position": user.position,
                        "department": user.department,
                        "location": user.location,
                        "phone": user.phone,
                        "typeLeave": user.typeLeave,
                        "reason": user.reason,
                        "date": user.date,
                        "status": user.status,
                        "statusHR": user.statusHR,
                        "reasonSuper": user.reasonSuper,
                        "dateApprove": user.dateApproved,
                        "startDate": user.startDate,
                        "endDate": user.endDate,
                        "dateRecord": user.dateRecord,
                        "total": user.total,
                        "record": user.record,
                        "comment": user.comment,
                        "statusUser": false

                    }
                }

            }

        }
        else {
            return { message: "You are nor HR" }
        }
    }


    async findLogId(id: string) {
        const user = await getConnection().getRepository(tbLog).find({ where: { userId: id }, order: { logId: "DESC" } })
        const result = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: id } })
        var Arr = [];
        if (result.position == "Chief Executive Officer​") {

            const thaiToEngStatus = ['สำเร็จ', 'ไม่สำเร็จ']
            const thaiToEngCategory = ['เข้าสู่ระบบ', 'เพิ่มผู้ใช้', 'แก้ไขข้อมูล', 'ส่งใบลา', 'ลบผู้ใช้', 'อนุมัติการลา']
            const engStatus = ['Success', 'Fail']
            const engCategory = ['Login', 'Add user', 'Edit user', 'Send leave', 'Delete user', 'Approve leave']

            user.map((x, i) => {
                const indexStatus = thaiToEngStatus.indexOf(x.status);

                x.status = engStatus[indexStatus]

                const indexCategory = thaiToEngCategory.indexOf(x.category);
                x.category = engCategory[indexCategory]
                var array = x.comment.split(" ")
                if (array[0] == "ใบลาเลขที่คำร้อง") {
                    x.comment = array[0] + " " + array[1] + " " + array[2]
                }
                else if (array[0] == "ผู้ใช้ทำการส่งใบลาเลขที่คำร้อง") {
                    x.comment = array[0] + " " + array[1]
                }
                else {
                    x.comment = array[1] + " " + array[2] + " " + array[0]
                }
                x.comment = x.comment.replace("มีการเข้าสู่ระบบของผู้ใช้", "have been logged in");
                x.comment = x.comment.replace("ผู้ใช้ทำการส่งใบลาเลขที่คำร้อง", "User submits a  leave application No.");
                x.comment = x.comment.replace("ลบผู้ใช้งาน", "have been delete");
                x.comment = x.comment.replace("เพิ่มผู้ใช้งาน", "have been create");
                x.comment = x.comment.replace("ใบลาเลขที่คำร้อง", "Leave Application No.");
                x.comment = x.comment.replace("ได้รับการอนุมัติเรียบร้อย", "have been approve");
                x.comment = x.comment.replace("ได้รับการลงบันทึกเรียบร้อย", "have been record");
                x.comment = x.comment.replace("ได้รับการไม่อนุมัติ", "have been reject");

            });

            user.map((x, i) => {
                Arr.push({
                    "logId": x.logId,
                    "category": x.category,
                    "userId": x.userId,
                    "comment": x.comment,
                    "status": x.status,
                    "date": x.time
                })
            });
        }
        else {
            user.map((x, i) => {
                Arr.push({
                    "logId": x.logId,
                    "category": x.category,
                    "userId": x.userId,
                    "comment": x.comment,
                    "status": x.status,
                    "date": x.time
                })
            });

        }
        return {
            message: Arr
        }
    }

    async findLogAll() {
        const user = await getManager().createQueryBuilder(tbLog, 't1')
            .select('t1.category', 'category')
            .addSelect('t1.comment', 'comment')
            .addSelect('t1.status', 'status')
            .addSelect('t1.time', 'time')
            .addSelect('t2.firstName', 'firstName')
            .addSelect('t2.lastName', 'lastName')
            .addSelect('t2.department', 'department')
            .addSelect('t2.position', 'position')
            .innerJoin(tbUserProfile, 't2', 't1.userId = t2.userId').orderBy('t1.logId', "DESC").getRawMany()
        // const userP = await getConnection().getRepository(tbUserProfile).findOne({ "userId": +userId })
        var Arr = [];

        user.map((x, i) => {
            Arr.push({
                "number": i,
                "status": x.status,
                "category": x.category,
                "name": x.firstName + " " + x.lastName,
                "department": x.department,
                "position": x.position,
                "comment": x.comment,
                "date": x.time
            })
        });

        return { message: Arr }
    }

    async getUser() {
        const result = await getConnection().getRepository(tbUser).find()
        return result
    }


    async getUserProfile(userId: string) {
        const userP = await getConnection().getRepository(tbUserProfile).findOne({ "userId": +userId })
        const user = await getConnection().getRepository(tbUser).findOne({ "userId": +userId })

        return {

            message: {
                "email": user.email,
                // "firstName": userP.firstName[0].toUpperCase() + userP.firstName.slice(1, userP.firstName.length),
                // "lastName": userP.lastName[0].toUpperCase() + userP.lastName.slice(1, userP.lastName.length),
                "firstName": userP.firstName,
                "lastName": userP.lastName,
                "staffId": userP.staffId,
                "position": userP.position,
                "department": userP.department,
                "phone": userP.phone,
                "profileId": userP.profileId,
                "startingDate": userP.startingDate,
                "userId": userP.userId





            }

        }
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
                const numVacationLeave = +result[i].vacationLeave
                if (numVacationLeave > 4) {
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
        const result = await getConnection().getRepository(tbUserProfile).find({ "position": Not(Equal("Admin Executive​")) })
        var Arr = [];
        for (let i = 0; i < result.length; i++) {
            Arr.push({
                "number": i,
                "userId": result[i].userId,
                "staffId": result[i].staffId,
                "name": result[i].firstName + " " + result[i].lastName,
                // "firstName": result[i].firstName[0].toUpperCase() + result[i].firstName.slice(1, result[i].firstName.length),
                // "lastName": result[i].lastName[0].toUpperCase() + result[i].lastName.slice(1, result[i].lastName.length),
                "firstName": result[i].firstName,
                "lastName": result[i].lastName,
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
        const result = await getConnection().getRepository(tbLeave).find({ order: { leaveId: "DESC" } })
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
            "Position": [
                "Chief Executive Officer​",
                "Chief Business Officer​",
                "Territorial Business Lead​",
                "Social Innovation Associates​​",
                "Business Investment Associates​​",
                "Financial Investment Associates​",
                "Chief Technical Officer​",
                "Innovation Lead​",
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
                "HR Executive​",
                "Finance Manager​​",
                "Finance Exec​​​"

            ],
            "Department": ["Executive Team",
                "Business Team",
                "Technical Team",
                "Compliance Team",
                "Legal Team",
                "Marketing Team",
                "Innovation Team",
                "Finance Team",


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
        const newRole = role.split(' ').join('')

        var roleStaff = [
            "SocialInnovationAssociates​​",
            "BusinessInvestmentAssociates​​",
            "FinancialInvestmentAssociates​",
            "InnovationAssociates​",
            "UX",
            "UI/Graphics",
            "Graphics​",
            "FrontEndDeveloper​",
            "BackEndDeveloper",
            "CloudInfraEngineer",
            "SecurityEngineer​​",
            "PR​",
            "ContentWriter​​",
            "GraphicDesigner/Animator​​​",
            "EventCo-Ordinator​​",
            "DigitalMarketing ​",
            "VideoEditor",
            "Videographer/Photographer​",
            "LegalExecutive​",
            "ComplianceExecutive​​",
            "FinanceManager​​",
            "FinanceExec​​​"]

        var roleSuper = [
            "InnovationLead​",
            "DevelopmentLead​",
            "TerritorialBusinessLead​",
            "UX/UILead​",
            "ChiefExecutiveOfficer​",
            "ChiefBusinessOfficer​",
            "ChiefComplianceOfficer​",
            "ChiefFinanceOfficer",
            "ChiefLegalOfficer​​",
            "ChiefTechnicalOfficer​",
            "ChiefMarketingOfficer​​",
        ]

        var roleHr = ["HRExecutive"]

        var roleAdmin = [ "AdminExecutive​",]

        if (roleStaff.includes(newRole)) {
            const roleUser = enumRoleUser.staff
            return roleUser
        }
        if (roleSuper.includes(newRole)) {
            const roleUser = enumRoleUser.super
            return roleUser
        }
        if (roleHr.includes(newRole)) {
            const roleUser = enumRoleUser.HR
            return roleUser
        }
        if (roleAdmin.includes(newRole)) {
            const roleUser = enumRoleUser.admin
            return roleUser
        }
    }


    checkroleLeaveUser(role: string) {
        const newRole1 = role.split(' ').join('')
        const newRole = newRole1.split('/').join('')

        var TerritorialBusinessLead = [
            "Social Innovation Associates​​",
            "Business Investment Associates​​",
            "Financial Investment Associates​",]

        var InnovationLead = ["Innovation Associates​",]
        var UXUILead = [
            "UX",
            "UI / Graphics",
            "Graphics​",]

        var DevelopmentLead = [
            "Front End Developer​",
            "Back End Developer",]


        var ChiefBusinessOfficer = ["TerritorialBusinessLead​"]

        var ChiefTechnicalOfficer = [
            "Innovation Lead​",
            "UX/UI Lead​​",
            "Development Lead​",
            "Cloud Infra Engineer",
            "Security Engineer​​",]

        var ChiefMarketingOfficer = ["PR​",
            "Content Writer​​",
            "GraphicDesigner / Animator​​​",
            "EventCo-Ordinator​​",
            "DigitalMarketing ​",
            "VideoEditor",
            "Videographer / Photographer​",]

        var ChiefLegalOfficer = ["Legal Executive​",]

        var ChiefComplianceOfficer = ["Compliance Executive​​",]

        var ChiefFinanceOfficer = [
            "Finance Manager​​",
            "Finance Exec​​​",
            "Admin Executive​",
            "HR Executive​",
        ]

        var ChiefExecutiveOfficer = [
            "Chief Business Officer",
            "Chief Technical Officer​",
            "Chief Marketing Officer​​",
            "Chief Legal Officer​​",
            "Chief Compliance Officer​",
            "Chief Finance Officer​",
        ]

        var HRExecutive = ["Chief Executive Officer​"]
        if ("HRExecutive​" == newRole) {
            return HRExecutive
        }


        if ("TerritorialBusinessLead​" == newRole) {
            return TerritorialBusinessLead
        }
        if ("InnovationLead" == newRole) {

            return InnovationLead
        }

        if ("UXUILead​" == newRole) {
  
            return UXUILead
        }
        if ("DevelopmentLead​" == newRole) {
            return DevelopmentLead
        }
        if ("ChiefBusinessOfficer" == newRole) {
            return ChiefBusinessOfficer
        }

        if ("ChiefTechnicalOfficer​" == newRole) {
            return ChiefTechnicalOfficer
        }
        if ("ChiefMarketingOfficer​​" == newRole) {
            return ChiefMarketingOfficer
        }
        if ("ChiefLegalOfficer​​" == newRole) {
            return ChiefLegalOfficer
        }
        if ("ChiefComplianceOfficer​" == newRole) {

            return ChiefComplianceOfficer
        }

        if ("ChiefFinanceOfficer" == newRole) {

            return ChiefFinanceOfficer
        }
        if ("ChiefExecutiveOfficer​" == newRole) {

            return ChiefExecutiveOfficer
        }

        else {
            return newRole
        }



    }

    async getLeaveSuper(user: any, position: string) {
        const leave = await getManager().createQueryBuilder(tbLeave, "post")
            .where("post.position IN (:position)", { position: user })
            .orderBy("post.leaveId", "DESC")
            .getMany();

        var Arr = [];
        if (position == "Chief Executive Officer​") {

            const thaiToEngStatus = ['ไม่อนุมัติ', 'อนุมัติเรียบร้อย', 'รอการอนุมัติ']
            const thaiToEngCategory = ['ลาป่วย', 'ลาพักร้อน', 'ลากิจ', 'ลาโดยไม่รับค้าจ้าง', 'ลาหยุดทดแทน']
            const engStatus = ['Rejected', 'Approved', 'Pending approval']
            const engCategory = ['Sick leave', 'Annual leave', 'Business leave', 'Leave without pay', 'Off in lieu']

            leave.map((x, i) => {
                const indexStatus = thaiToEngStatus.indexOf(x.status);

                x.status = engStatus[indexStatus]

                const indexCategory = thaiToEngCategory.indexOf(x.typeLeave);
                x.typeLeave = engCategory[indexCategory]

            });

            leave.map((x, i) => {
                Arr.push({
                    "number": i,
                    "leaveId": x.leaveId,
                    "name": x.name,
                    "category": x.typeLeave,
                    "total": x.total,
                    "status": x.status,
                    "date": x.date
                })
            });





            return Arr
        }
        else {
            leave.map((x, i) => {
                Arr.push({
                    "number": i,
                    "leaveId": x.leaveId,
                    "name": x.name,
                    "category": x.typeLeave,
                    "total": x.total,
                    "status": x.status,
                    "date": x.date
                })
            });
            return Arr

        }
    }

    async getLeaveHR(staffId: string) {
        const leave = await getConnection().getRepository(tbLeave).find({
            where: {
                staffId: Not(Equal(staffId)),
                status: (Equal("อนุมัติเรียบร้อย")),
            }, order: { leaveId: "DESC" }
        })
        var Arr = [];
        leave.map((x, i) => {
            if (x.statusHR == "ลงบันทึกเรียบร้อย") {
                Arr.push({
                    "number": i,
                    "leaveId": x.leaveId,
                    "name": x.name,
                    "category": x.typeLeave,
                    "total": x.total,
                    "status": x.status,
                    "statusHR": x.statusHR,
                    "date": x.dateRecord
                })
            }
            else {
                Arr.push({
                    "number": i,
                    "leaveId": x.leaveId,
                    "name": x.name,
                    "category": x.typeLeave,
                    "total": x.total,
                    "status": x.status,
                    "statusHR": x.statusHR,
                    "date": x.dateApproved
                })

            }

        });

        return Arr
    }




    // **************** Update *********************



    async editUserProfileAdmin(userProfileDto: UserProfileDto) {
        const num = +userProfileDto.userId
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
        const user = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: userProfileDto.userId } })
        if (checkStaffId.length === 0) {
            if (checkName.length === 0) {
                if (checkPhone.length === 0) {

                    let userP = new tbUserProfile()
                    userP.profileId = user.profileId
                    userP.firstName = userProfileDto.firstName[0].toUpperCase() + userProfileDto.firstName.slice(1, userProfileDto.firstName.length).toLowerCase()
                    userP.lastName = userProfileDto.lastName[0].toUpperCase() + userProfileDto.lastName.slice(1, userProfileDto.lastName.length).toLowerCase()
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
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    return { name: userProfileDto.firstName + " " + userProfileDto.lastName, userId: user.userId, message: "Edit profile Success" }
                }
                else {
                    return { name: userProfileDto.firstName + " " + userProfileDto.lastName, userId: user.userId, message: "Phone number is used" }
                }
            }
            else {
                return { name: userProfileDto.firstName + " " + userProfileDto.lastName, userId: user.userId, message: "Name is used" }
            }
        }
        else {
            return { name: userProfileDto.firstName + " " + userProfileDto.lastName, userId: user.userId, message: "StaffID is used" }
        }
    }


    async editUserProfile(userId: string, editUserProfileDto: EditUserProfileDto) {
        const num = +userId

        const checkName = await getConnection().getRepository(tbUserProfile).find({
            userId: Not(Equal(num)),
            firstName: (Equal(editUserProfileDto.firstName)),
            lastName: (Equal(editUserProfileDto.lastName))
        })
        const checkPhone = await getConnection().getRepository(tbUserProfile).find({
            userId: Not(Equal(num)),
            phone: (Equal(editUserProfileDto.phone))
        })


        if (checkName.length === 0) {
            if (checkPhone.length === 0) {
                const user = await getConnection().getRepository(tbUserProfile).findOne({ where: { userId: userId } })
                let userP = new tbUserProfile()
                userP.profileId = user.profileId
                userP.firstName = editUserProfileDto.firstName[0].toUpperCase() + editUserProfileDto.firstName.slice(1, editUserProfileDto.firstName.length).toLowerCase()
                userP.lastName = editUserProfileDto.lastName[0].toUpperCase() + editUserProfileDto.lastName.slice(1, editUserProfileDto.lastName.length).toLowerCase()
                userP.staffId = user.staffId
                userP.phone = editUserProfileDto.phone
                userP.position = user.position
                userP.department = user.department
                userP.startingDate = user.startingDate
                userP.userId = user.userId
                userP.pin = user.pin
                userP.vacationLeave = user.vacationLeave
                userP.sickLeave = user.sickLeave
                userP.personalLeave = user.personalLeave
                await getConnection().getRepository(tbUserProfile).save(userP)
                return { message: "Edit profile success" ,name:userP.firstName+" "+ userP.lastName }
            }
            else {
                return { message: "Phone number is used" }
            }
        }
        else {
            return { message: "Name is used" }
        }


    }


    async addUserPin(userId: string, pinDto: PinDto) {
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
        const hashedPin = await bcrypt.hash(pinDto.pin, 12)
        userP.pin = hashedPin
        await getConnection().getRepository(tbUserProfile).save(userP)
        return { message: "Set pin Success" }
    }


    async editUserLeave(userId: string, approveDto: ApproveDto) {
        const user = await getConnection().getRepository(tbLeave).findOne({ where: { leaveId: approveDto.leaveId } })
        var time = new Date();
        const datetime = time.toString()
        let userLeave = new tbLeave()
        userLeave.leaveId = user.leaveId
        userLeave.name = user.name
        userLeave.staffId = user.staffId
        userLeave.position = user.position
        userLeave.department = user.department
        userLeave.location = user.location
        userLeave.phone = user.phone
        userLeave.typeLeave = user.typeLeave
        userLeave.startDate = user.startDate
        userLeave.endDate = user.endDate
        userLeave.total = user.total
        userLeave.reason = user.reason
        userLeave.date = user.date
        userLeave.status = approveDto.status
        userLeave.statusHR = "รอลงบันทึก"
        userLeave.reasonSuper = approveDto.reasonSuper
        userLeave.dateApproved = datetime
        userLeave.dateRecord = user.dateRecord
        userLeave.record = user.record
        userLeave.comment = user.comment


        await getConnection().getRepository(tbLeave).save(userLeave)
        const userProfile = await getConnection().getRepository(tbUserProfile).findOne({ where: { staffId: user.staffId } })
        const numTotal = +user.total
        const numVacationLeave = parseInt(userProfile.vacationLeave)
        const numSickLeave = parseInt(userProfile.sickLeave)
        const numPersonalLeave = parseInt(userProfile.personalLeave)
        let userP = new tbUserProfile()
        if (userLeave.status == "อนุมัติเรียบร้อย") {
            if (user.typeLeave == "ลาป่วย") {
                if (numSickLeave - numTotal >= 0) {
                    userP.profileId = userProfile.profileId
                    userP.firstName = userProfile.firstName
                    userP.lastName = userProfile.lastName
                    userP.staffId = userProfile.staffId
                    userP.phone = userProfile.phone
                    userP.position = userProfile.position
                    userP.department = userProfile.department
                    userP.startingDate = userProfile.startingDate
                    userP.userId = userProfile.userId
                    userP.pin = userProfile.pin
                    userP.vacationLeave = userProfile.vacationLeave
                    userP.sickLeave = (numSickLeave - numTotal).toString()
                    userP.personalLeave = userProfile.personalLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    await getConnection().getRepository(tbLeave).save(userLeave)
                    return { message: "Approve success" }
                } else {
                    return { message: "The rest of the days are not enough" }
                }
            }
            if (user.typeLeave == "ลาพักร้อน") {
                if (numVacationLeave - numTotal >= 0) {
                    userP.profileId = userProfile.profileId
                    userP.firstName = userProfile.firstName
                    userP.lastName = userProfile.lastName
                    userP.staffId = userProfile.staffId
                    userP.phone = userProfile.phone
                    userP.position = userProfile.position
                    userP.department = userProfile.department
                    userP.startingDate = userProfile.startingDate
                    userP.userId = userProfile.userId
                    userP.pin = userProfile.pin
                    userP.vacationLeave = (numVacationLeave - numTotal).toString()
                    userP.sickLeave = userProfile.sickLeave
                    userP.personalLeave = userProfile.personalLeave
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    await getConnection().getRepository(tbLeave).save(userLeave)
                    return { message: "Approve success" }
                }
                else {
                    return { message: "The rest of the days are not enough" }
                }
            }
            if (user.typeLeave == "ลากิจ") {
                if (numPersonalLeave - numTotal >= 0) {
                    userP.profileId = userProfile.profileId
                    userP.firstName = userProfile.firstName
                    userP.lastName = userProfile.lastName
                    userP.staffId = userProfile.staffId
                    userP.phone = userProfile.phone
                    userP.position = userProfile.position
                    userP.department = userProfile.department
                    userP.startingDate = userProfile.startingDate
                    userP.userId = userProfile.userId
                    userP.pin = userProfile.pin
                    userP.vacationLeave = userProfile.vacationLeave
                    userP.sickLeave = userProfile.sickLeave
                    userP.personalLeave = (numPersonalLeave - numTotal).toString()
                    await getConnection().getRepository(tbUserProfile).save(userP)
                    await getConnection().getRepository(tbLeave).save(userLeave)
                    return { message: "Approve success" }
                }
                else {
                    return { message: "The rest of the days are not enough" }
                }
            }
            else {

                await getConnection().getRepository(tbLeave).save(userLeave)
                return { message: "Approve success" }
            }
        }
        else {
            userP.profileId = userProfile.profileId
            userP.firstName = userProfile.firstName
            userP.lastName = userProfile.lastName
            userP.staffId = userProfile.staffId
            userP.phone = userProfile.phone
            userP.position = userProfile.position
            userP.department = userProfile.department
            userP.startingDate = userProfile.startingDate
            userP.userId = userProfile.userId
            userP.pin = userProfile.pin
            userP.vacationLeave = userProfile.vacationLeave
            userP.sickLeave = userProfile.sickLeave
            userP.personalLeave = userProfile.personalLeave
            await getConnection().getRepository(tbUserProfile).save(userP)
            await getConnection().getRepository(tbLeave).save(userLeave)
            return { message: "Reject success" }
        }

    }


    async editRecordUserLeave(userId: string, recordDto: RecordDto) {
        const user = await getConnection().getRepository(tbLeave).findOne({ where: { leaveId: recordDto.leaveId } })
        var time = new Date();
        const datetime = time.toString()
        let userLeave = new tbLeave()
        userLeave.leaveId = user.leaveId
        userLeave.name = user.name
        userLeave.staffId = user.staffId
        userLeave.position = user.position
        userLeave.department = user.department
        userLeave.location = user.location
        userLeave.phone = user.phone
        userLeave.typeLeave = user.typeLeave
        userLeave.startDate = user.startDate
        userLeave.endDate = user.endDate
        userLeave.total = user.total
        userLeave.reason = user.reason
        userLeave.date = user.date
        userLeave.status = user.status
        userLeave.statusHR = recordDto.statusHR
        userLeave.reasonSuper = user.reasonSuper
        userLeave.dateApproved = user.dateApproved
        userLeave.dateRecord = datetime
        userLeave.record = recordDto.record
        userLeave.comment = recordDto.comment
        const userProfile = await getConnection().getRepository(tbUserProfile).findOne({ where: { staffId: user.staffId } })
        let userP = new tbUserProfile()
        await getConnection().getRepository(tbLeave).save(userLeave)
        return { message: "Record Success" }
     
    }


    // **************** Delete *********************


    async delUser(userId: number) {
        const userp = await getConnection().getRepository(tbUserProfile).find({ where: { userId: userId } })
        await getConnection().getRepository(tbUserProfile).delete(userp[0].profileId)
        await getConnection().getRepository(tbUser).delete(userId)
        return { message: "Delete Success" }

    }


    // ******************** api ************************

    sendMail(subject: string, detail: string, email: string) {
        const nodemailer = require("nodemailer");
        let transporter = nodemailer.createTransport({
            host: 'gmail',
            service: 'Gmail',
            auth: {
                user: 'heartnxz01@gmail.com',
                pass: '@Heart650',
            },
        });

        // รายละเอียดอีเมล
        const userp = transporter.sendMail({
            from: 'HR',   // ผู้ส่ง
            to: email,// ผู้รับ
            subject: subject,                      // หัวข้อ
            text: "ลาสำเร็จ",                         // ข้อความ
            html: detail

        }, (err, info) => {
            if (err) {
                return { message: err };
            } else {
                return { message: info.messageId };
            }
        });
        return { message: "Send Success" }


    }

}