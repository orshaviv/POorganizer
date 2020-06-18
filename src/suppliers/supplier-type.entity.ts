import {BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Supplier} from "./supplier.entity";
import {Contact} from "../contacts/contact.entity";
import {Item} from "../items/item.entity";

@Entity()
export class SupplierType extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public type: string;

    @ManyToMany(type => Supplier, supplier => supplier.types)
    public suppliers: Supplier[];
}
