import {EntityRepository, Repository} from "typeorm";
import {SupplierType} from "./supplier-type.entity";
import {GetSuppliersTypesFilterDto} from "./dto/get-suppliers-types-filter.dto";

@EntityRepository(SupplierType)
export class SupplierTypeRepository extends Repository<SupplierType> {
    async createOrFindSupplierType(
        types: string[]
    ): Promise<SupplierType[]> {

        let supplierTypes: SupplierType[] = [];

        for (const type of types) {
            let supplierType = new SupplierType();
            supplierType.type = type;
            try{
                await supplierType.save();
            } catch {
                supplierType = await this.findOne({ type });
            }
            supplierTypes.push(supplierType);
        }

        return supplierTypes;
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
                '(supplier_type.types LIKE :search)', { search: `%${ search }%` }
            );
        }

        return await query.getMany();
    }
}
