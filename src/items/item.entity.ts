import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "../auth/user.entity";

@Entity({name: 'item'})
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: false, nullable: false })
    public catalogNumber: string;

    @Column({ nullable: true })
    public name: string;

    @Column({ nullable: true })
    public type: string;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @ManyToOne(type => User,user => user.items)
    public user: User;

    @Column()
    public userId: number;
}

