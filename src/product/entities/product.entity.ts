import { text } from "stream/consumers";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({name: 'products'})
export class Product {
    
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('text', {
        unique: true
    })
    title: string;

    @Column('float',{
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0 
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string

    @Column('text',{
        array: true,
        default: () => "'{}'"
    })
    tags: string[];

    @OneToMany(
        ()=> ProductImage,
        productImage => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[];

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title
        }
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll('','_')
            .replaceAll("'",'')
    }

    @BeforeInsert()
    checkSlugUpdate(){
        this.slug = this.slug
        .toLocaleLowerCase()
        .replaceAll('','_')
        .replaceAll("'",'')
    
    }
}


