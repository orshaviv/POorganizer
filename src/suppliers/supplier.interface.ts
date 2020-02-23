import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'suppliers'})
export class Supplier {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({length: 45, unique: true})
    public supplier_name!: string;
}
