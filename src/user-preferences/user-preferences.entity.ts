import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {MaxLength} from "class-validator";

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

    @Column( 'mediumtext', { nullable: true })
    public headerLogo: string;

    @Column( 'mediumtext', { nullable: true })
    public footerLogo: string;
}
