import {EntityRepository, Repository} from "typeorm";
import {Supplier} from "./supplier.interface";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {SupplierDTO} from "./dto/supplier.dto";
import {NotAcceptableException} from "@nestjs/common";

@EntityRepository(Supplier)
export class SupplierRepository extends Repository<Supplier> {
    async getSuppliers(filterDto: GetSuppliersFilterDto): Promise<Supplier[]> {
        const {id, search} = filterDto;
        const query = this.createQueryBuilder('supplier');

        if (id) {
            const idNum = parseInt(id,10);
            query.andWhere('supplier.id = :idNum', {idNum})
        }

        if (search) {
            query.andWhere(
                '(supplier.name LIKE :search OR ' +
                    'supplier.country LIKE :search OR ' +
                    'supplier.country LIKE :search OR ' +
                    'supplier.city LIKE :search OR ' +
                    'supplier.streetAddress LIKE :search OR ' +
                    'supplier.type LIKE :search OR ' +
                    'supplier.notes LIKE :search)', {search: `%${search}%`}
                    );
        }

        const suppliers = await query.getMany();
        return suppliers;
    }

    async addNewSupplier(supplierDto: SupplierDTO): Promise<Supplier>{
        let supplier = new Supplier();
        supplier.name = supplierDto.name;
        supplier.country = !supplierDto.country? null : supplierDto.country;
        supplier.city = !supplierDto.city? null : supplierDto.city;
        supplier.streetAddress = !supplierDto.streetAddress? null : supplierDto.streetAddress;
        supplier.type = !supplierDto.type? null : supplierDto.type;
        supplier.notes = !supplierDto.notes? null : supplierDto.notes;

        try{
            await supplier.save();
            console.log('Supplier Added.');
        }catch (error){
            throw new NotAcceptableException(`Supplier named "${supplierDto.name}" already exists.`);
        }

        return supplier;
    }

}
