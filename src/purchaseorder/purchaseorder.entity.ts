import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../auth/user.entity";

export enum POStatus {
    OPEN,
    SENT,
    CANCELED,
}

export enum PaymentStatus {
    PAID,
    REFUND,
    PENDING
}

export enum DeliveryMethod {
    PICKUP,
    DELIVERY
}

@Entity()
export class PurchaseOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public poId: string;

    @Column()
    public poStatus: POStatus;

    @Column()
    public deliveryMethod: DeliveryMethod;

    @Column()
    public paymentMethod: string;

    @Column()
    public paymentStatus: PaymentStatus;

    @Column()
    public completionDate: Date;

    @Column()
    public supplierName: string;

    @Column()
    public contactName: string;

    @Column('simple-array', { nullable: false })
    public quantity: string[];

    @Column('simple-array', { nullable: false })
    public catalogNumber: string[];

    @Column('simple-array', { nullable: false })
    public details: string[];

    @Column('simple-array', { nullable: false })
    public itemCost: string[];

    @Column({ nullable: false })
    public totalCostBeforeTax: number;

    @Column({ nullable: false, default: 0.17 })
    public taxPercentage: number;

    //Author and company details
    @Column()
    public companyCode: string;

    @Column()
    public companyAddress: string;

    @Column()
    public companyEmail: string;

    @Column()
    public companyWebsite: string;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @ManyToOne(type => User, user => user.purchaseOrders)
    public user: User;

    @Column()
    public userId: number;
}
