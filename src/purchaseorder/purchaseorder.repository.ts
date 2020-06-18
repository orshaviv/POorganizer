import {EntityRepository, Repository} from "typeorm";
import {PurchaseOrder} from "./purchaseorder.entity";
import {Logger} from "@nestjs/common";
import {User} from "../auth/user.entity";

@EntityRepository(PurchaseOrder)
export class PurchaseOrderRepository extends Repository<PurchaseOrder> {
    private logger = new Logger('PurchaseOrderRepository');

    async getPurchaseOrders(
        user: User
    ): Promise<PurchaseOrder[]> {
        return this.find({ userId: user.id });
    }

    async getPurchaseOrdersUntilDate(
        date: Date,
        user: User,
    ): Promise<PurchaseOrder[]> {
        const year = date.getFullYear();
        const month = date.getMonth();

        const poList = await this.getPurchaseOrders(user);

        return poList.filter(po => {
            let creationDate = po.created_at;
            return (creationDate.getFullYear() <= year && creationDate.getMonth() <= month);
        });
    }
}
