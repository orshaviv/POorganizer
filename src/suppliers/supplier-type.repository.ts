import {EntityRepository, Repository} from "typeorm";
import {SupplierType} from "./supplier-type.entity";

@EntityRepository(SupplierType)
export class SupplierTypeRepository extends Repository<SupplierType> {
    async createOrFindSupplierType(
        types: string[]
    ): Promise<SupplierType[]> {
        let supplierTypes: SupplierType[] = [];

        for (const type of types) {
            let supplierType = await this.findOne({ type });

            if (!supplierType) {
                let supplierType = new SupplierType();
                supplierType.type = type;
                await supplierType.save();
            }
            supplierTypes.push(supplierType);
        }

        return supplierTypes;
    }

    getTypes(
        search: string
    ): Promise<SupplierType[]> {
        const query = this.createQueryBuilder('supplier_type');

        if (search) {
            query.andWhere(
                '(supplier_type.types LIKE :search)', { search: `%${ search }%` }
            );
        }

        return query.getMany();
    }
}
