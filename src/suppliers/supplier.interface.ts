import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Supplier {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 45, unique: true})
    public name: string;

    @Column({ unique: false})
    public country: string;

    @Column({ unique: false})
    public city: string;

    @Column({ unique: false})
    public streetAddress: string;

    @Column({ unique: false})
    public type: string;

    @Column({ unique: false})
    public notes: string;

    /*
    @Column({ default: 'true' })
    isActive: string; // other options can be such as 'false', 'canceled'.
     */
}
