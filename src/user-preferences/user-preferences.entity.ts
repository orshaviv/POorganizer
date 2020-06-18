import {BaseEntity, Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../auth/user.entity";


@Entity()
export class UserPreferences extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true, nullable: true })
    public companyName: string;

    @Column({ unique: true, nullable: true })
    public companyCode: string;

    @Column({ unique: true, nullable: true })
    public companyAddress: string;

    @Column({ unique: true, nullable: true })
    public companyEmail: string;

    @Column({ unique: true, nullable: true })
    public companyWebsite: string;
}
