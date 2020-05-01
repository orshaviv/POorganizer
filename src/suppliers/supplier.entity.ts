import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import {User} from "../auth/user.entity";
import {SupplierType} from "./supplier-type.entity";

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

    //@Column({ nullable: true, unique: false})
    //public type: string;

    @ManyToOne(type => SupplierType, type => type.suppliers, {eager: false} )
    public type: SupplierType;

    @Column({ nullable: true, unique: false})
    public notes: string;

    @ManyToOne(type => User, user => user.suppliers, { eager: false } )
    public user: User;

    @Column()
    public userId: number;

    @Column()
    public typeId: number;
}
