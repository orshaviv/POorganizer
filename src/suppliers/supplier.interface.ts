import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'suppliers'})
export class Supplier {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({length: 45, unique: true})
    public supplierName!: string;

    @Column({ unique: false})
    public country!: string;

    @Column({ unique: false})
    public city!: string;

    @Column({ unique: false})
    public streetAddress!: string;

    @Column({ unique: false})
    public classify!: string;

    @Column({ unique: false})
    public notes!: string;
}
