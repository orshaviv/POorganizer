import {IsMobilePhone, IsNotEmpty, IsPhoneNumber} from "class-validator";
import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../auth/user.entity";
import {Contact} from "./contact.entity";

@Entity({name: 'contact_information'})
export class ContactInformation extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false } )
    @IsNotEmpty()
    public phoneType: string;

    @Column('nvarchar', { nullable: false, default: 'IL' } )
    @IsNotEmpty()
    public locale: string;

    @Column( { unique: true, default: null  })
    @IsMobilePhone(this.locale)
    public cellphoneNumber: string;

    @Column( { unique: true, default: null })
    @IsPhoneNumber(null)
    public phoneNumber: string;

    @ManyToOne(type => Contact, contact => contact.contactInformation, { eager: false })
    public contact: Contact;

    @Column()
    public contactId: number;

    @ManyToOne(type => User, user => user.contactsInformation, { eager: false } )
    public user: User;

    @Column()
    public userId: number;

    public setPhoneNumber(phoneType: string, locale: string, phone: string) {
        this.phoneType = phoneType;
        this.locale = locale? locale : 'ZZ';
        if (phoneType.toUpperCase() === 'MOBILE') {
            this.cellphoneNumber = phone;
        }else{
            this.phoneNumber = phone;
        }
    }
}
