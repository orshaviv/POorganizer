import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, CreateDateColumn, OneToMany} from "typeorm";
import {User} from "../auth/user.entity";
import {SupplierType} from "./supplier-type.entity";
import {Contact} from "../contacts/contact.entity";

@Entity()
export class Supplier extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 45, unique: true})
    public name: string;

    @Column({ nullable: true, unique: false})
    public country: string;

    @Column({ nullable: true, unique: false})
    public city: string;

    @Column({ nullable: true, unique: false})
    public streetAddress: string;

    @ManyToOne(type => SupplierType, type => type.suppliers, { eager: false } )
    public type: SupplierType;

    @Column()
    public typeId: number;

    @OneToMany(type => Contact, contact => contact.supplier, { eager: true } )
    public contacts: Contact[];

    @Column({ nullable: true, unique: false})
    public notes: string;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @ManyToOne(type => User, user => user.suppliers, { eager: false } )
    public user: User;

    @Column()
    public userId: number;
}
