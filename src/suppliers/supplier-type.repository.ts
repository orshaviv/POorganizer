import {EntityRepository, Repository} from "typeorm";
import {SupplierType} from "./supplier-type.entity";

@EntityRepository(SupplierType)
export class SupplierTypeRepository extends Repository<SupplierType> {
    async createOrUpdateSupplierType(type: string): Promise<SupplierType> {
        let supplierType = new SupplierType();
        supplierType.type = type;

        try{
            await supplierType.save();
            console.log('New Supplier type Added.');
        } catch {
            supplierType = await this.findOne({type});
            console.log('Supplier type already exists.');
        }

        return supplierType;
    }
}
