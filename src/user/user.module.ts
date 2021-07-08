import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { AdminService } from './service/admin.service';
import { adminController } from './controller/admin.controller'
import { superController } from './controller/super.controller'
import { alluserController } from './controller/alluser.controller'
import { hrController } from './controller/hr.controller'
import { tbUser } from './entities/tbUser.entity';
import { tbLog } from './entities/tbLog.entity';
import { tbLeave } from './entities/tbLeave.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from "@nestjs/jwt";
import { tbUserProfile } from './entities/tbUserProfile';
import { AllUserService } from "./service/alluser.service";
import { SuperService } from "./service/super.service";
import { HrService } from "./service/hr.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      tbUser,
      tbUserProfile,
      tbLog,
      tbLeave
    ])
    , ScheduleModule.forRoot(),
    JwtModule.register({
      secret: 'secret',
    })
  ],
  controllers: [
    adminController,
    alluserController,
    superController,
    hrController
  ],
  providers: [
    UserService,
    AdminService,
    AllUserService,
    SuperService,
    HrService

  ]
})
export class UserModule { }

