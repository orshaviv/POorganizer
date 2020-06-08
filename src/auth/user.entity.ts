import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import * as bcrypt from 'bcryptjs';
import {Supplier} from "../suppliers/supplier.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column({unique: true})
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    uuid: string;

    @OneToMany(type => Supplier, supplier => supplier.user, { eager: true })
    suppliers: Supplier[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
