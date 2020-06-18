import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcryptjs';
import {Supplier} from "../suppliers/supplier.entity";

import {ContactInformation} from "../contacts/contact-information.entity";
import {Contact} from "../contacts/contact.entity";
import {Item} from "../items/item.entity";
import {PurchaseOrder} from "../purchaseorder/purchaseorder.entity";

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

    @OneToMany(type => Contact, contact => contact.user, { eager: true })
    contacts: Contact[];

    @OneToMany(type => Item, item => item.user, { eager: true })
    items: Item[];

    @OneToMany(type => PurchaseOrder, po => po.user, { eager: true })
    purchaseOrders: PurchaseOrder[];

    @OneToMany(type => ContactInformation, contactInformation => contactInformation.user, { eager: true })
    contactsInformation: ContactInformation[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
