import {EntityRepository, Repository} from "typeorm";
import {SupplierType} from "./supplier-type.entity";
import {GetSuppliersTypesFilterDto} from "./dto/get-suppliers-types-filter.dto";

@EntityRepository(SupplierType)
export class SupplierTypeRepository extends Repository<SupplierType> {
    async createOrFindSupplierType(
        type: string
    ): Promise<SupplierType> {
        let supplierType = new SupplierType();
        supplierType.type = type;

        try{
            await supplierType.save();
        } catch {
            supplierType = await this.findOne({type});
        }

        return supplierType;
    }

    async getTypes(
        getSuppliersTypesFilterDto: GetSuppliersTypesFilterDto,
    ): Promise<SupplierType[]> {
        const {id, search} = getSuppliersTypesFilterDto;

        const query = this.createQueryBuilder('supplier_type');

        if (id) {
            query.andWhere('(supplier_type.id = :id)', { id });
        } else if (search) {
            query.andWhere(
                '(supplier_type.type LIKE :search)', { search: `%${ search }%` }
            );
        }

        return await query.getMany();
    }
}
