import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Supplier} from "./supplier.entity";


@Entity()
export class SupplierType extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({unique: true})
    public type: string;

    @OneToMany(type => Supplier, supplier => supplier.type, {eager: true} )
    public suppliers: Supplier[];
}
