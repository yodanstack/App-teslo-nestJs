import { isBoolean } from "class-validator";
import { Product } from "src/product/entities";
import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product

    @BeforeInsert()
    checkFilesBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFilesBeforeUpdate(){
        this.checkFilesBeforeInsert();
    }
}
