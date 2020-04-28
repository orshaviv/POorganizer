import {EntityRepository, Repository} from "typeorm";
import {Supplier} from "./supplier.entity";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {SupplierDTO} from "./dto/supplier.dto";
import {ConflictException, NotAcceptableException} from "@nestjs/common";

@EntityRepository(Supplier)
export class SupplierRepository extends Repository<Supplier> {
    async getSuppliers(filterDto: GetSuppliersFilterDto): Promise<Supplier[]> {
        const {id, search} = filterDto;
        const query = this.createQueryBuilder('supplier');

        if (id) {
            query.andWhere('supplier.id = :id', { id })
        }

        if (search) {
            query.andWhere(
                '(supplier.name LIKE :search OR ' +
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

    async addNewSupplier(supplierDto: SupplierDTO): Promise<Supplier> {
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
            throw new ConflictException(`Supplier named "${supplierDto.name}" already exists.`);
        }

        return supplier;
    }

    async updateSupplier(supplierDto: SupplierDTO): Promise<Supplier> {
        const {id, name, country, city, streetAddress, type, notes} = supplierDto;

        if (!id){
            throw new NotAcceptableException('Supplier ID is not specified.');
        }
        const supplier = await this.findOne({ id }); //getSupplierById(id);

        if (typeof name !== undefined){
            const exists = !!(await this.findOne({ name }));
            if(exists){
                throw new ConflictException(`Supplier named "${supplierDto.name}" already exists.`);
            }
            supplier.name = name;
        }
        if (typeof country !== undefined){
            supplier.country = country;
        }
        if (typeof city !== undefined){
            supplier.city = city;
        }
        if (typeof streetAddress !== undefined){
            supplier.streetAddress = streetAddress;
        }
        if (typeof type !== undefined){
            supplier.type = type;
        }
        if (typeof notes !== undefined){
            supplier.notes = notes;
        }

        await supplier.save();
        return supplier;
    }
}
