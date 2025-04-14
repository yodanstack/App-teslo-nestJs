import { isBoolean } from "class-validator";
import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text',{
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool',{
        default: true
    })
    isActive: boolean;

     @Column('text', {
            array: true,
            default: ['user']
        })
    roles: string[];


    @BeforeInsert()
    checkFilesBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFilesBeforeUpdate(){
        this.checkFilesBeforeInsert();
    }
}
