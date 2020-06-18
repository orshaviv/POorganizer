import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {IsEmail} from "class-validator";
import {User} from "../auth/user.entity";
import {Supplier} from "../suppliers/supplier.entity";
import {ContactInformation} from "./contact-information.entity";

@Entity({name: 'supplier_contact'})
export class Contact extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 50, unique: false })
    public first_name: string;

    @Column({ length: 50, unique: false })
    public last_name: string;

    @Column({ unique: false, default: '' })
    public email!: string;

    @OneToMany(type => ContactInformation,contactInformation => contactInformation.contact)
    public contactInformation: ContactInformation[];

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @ManyToOne(type => Supplier,supplier => supplier.contacts)
    public supplier: Supplier;

    @Column()
    public supplierId: number;

    @ManyToOne(type => User,user => user.contacts)
    public user: User;

    @Column()
    public userId: number;
}
