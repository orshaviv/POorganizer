import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import {User} from "../auth/user.entity";

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

    @Column({ nullable: true, unique: false})
    public type: string;

    @Column({ nullable: true, unique: false})
    public notes: string;

    @ManyToOne(type => User, user => user.suppliers, { eager: false })
    user: User;

    @Column()
    userId: number;
}
