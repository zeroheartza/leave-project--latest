import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class tbLog {
    @PrimaryGeneratedColumn()
    logId : number

    @Column()
    category: string

    @Column()
    userId: string

    @Column()
    comment: string

    @Column()
    status: string

    @Column()
    time: string


    
}