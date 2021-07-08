import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class tbLeave {
    @PrimaryGeneratedColumn()
    leaveId: number

    
    @Column()
    name: string

    @Column()
    staffId: string

    @Column()
    position: string

    @Column()
    department: string

    @Column()
   location: string

    @Column()
    phone : string

    @Column()
    typeLeave: string

    @Column()
    startDate: string

    @Column()
    endDate: string

    @Column()
    total: string

    @Column()
    reason: string

    @Column()
    date: string

    @Column()
    status: string

    @Column()
    statusHR: string

    @Column()
    reasonSuper: string

    @Column()
    dateApproved: string

    @Column()
    record: string

    @Column()
    dateRecord: string

    @Column()
    comment: string
    
 

}