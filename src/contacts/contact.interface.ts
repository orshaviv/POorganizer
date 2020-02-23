import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Length, IsEmail} from "class-validator";

@Entity({name: 'suppliers_contacts'})
export class Contact {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({length: 45, unique: false})
    public first_name!: string;

    @Column({ length: 10, unique: false})
    public last_name!: string;

    @Column({unique: true})
    @Length(9,10)
    public tel!: string;

    @Column({unique: true})
    @IsEmail()
    public email!: string;

    @Column({nullable: false})
    public supplier_id!: number;
}
