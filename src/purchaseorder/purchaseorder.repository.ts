import {EntityRepository, Repository} from "typeorm";
import {PurchaseOrder} from "./purchaseorder.entity";
import {InternalServerErrorException, Logger} from "@nestjs/common";
import {User} from "../auth/user.entity";

@EntityRepository(PurchaseOrder)
export class PurchaseOrderRepository extends Repository<PurchaseOrder> {
    private logger = new Logger('PurchaseOrderRepository');

    async getPurchaseOrders(
        search: string,
        user: User
    ): Promise<PurchaseOrder[]> {
        const query = this.createQueryBuilder('purchaseorder');

        query.where('purchaseorder.userId = :userId', { userId: user.id });

        if (search) {
            query.andWhere(
                '(purchaseorder.poId LIKE :search OR ' +
                'purchaseorder.poStatus LIKE :search OR ' +
                'purchaseorder.deliveryMethod LIKE :search OR ' +
                'purchaseorder.paymentMethod LIKE :search OR ' +
                'purchaseorder.paymentStatus LIKE :search OR ' +
                'purchaseorder.completionDate LIKE :search OR ' +
                'purchaseorder.supplierName LIKE :search OR ' +
                'purchaseorder.contactName LIKE :search)'
                ,{ search: `%${ search }%` }
            );
        }

        try {
            const purchaseOrders = await query.getMany();
            return purchaseOrders;
        } catch (error) {
            this.logger.error(`Failed to get purchase orders for user ${user.firstName} ${user.lastName}. Filters: ${ search }`, error.stack);
            throw new InternalServerErrorException(error);
        }
    }

    async getPurchaseOrdersUntilDate(
        date: Date,
        user: User,
    ): Promise<PurchaseOrder[]> {
        const year = date.getFullYear();
        const month = date.getMonth();

        const poList = await this.getPurchaseOrders(null, user);

        return poList.filter(po => {
            let creationDate = po.created_at;
            return (creationDate.getFullYear() <= year && creationDate.getMonth() <= month);
        });
    }
}
