import {BadRequestException, Injectable, NotAcceptableException, NotFoundException} from "@nestjs/common";
import {Supplier} from "./supplier.interface";
import {Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";
import {SupplierDTO} from "./dto/supplier.dto";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {SupplierRepository} from "./supplier.repository";

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(SupplierRepository)
        private suppliersRepo: SupplierRepository,
    ) {}

    getSuppliers(filterDto?: GetSuppliersFilterDto): Promise<Supplier[]> {
        return this.suppliersRepo.getSuppliers(filterDto);
    }

    async getSupplierById(id: string): Promise<Supplier> {
        const idNum = parseInt(id,10);
        let supplier = await this.suppliersRepo.findOne({ id: idNum });

        if (!supplier){
            throw new NotFoundException(`Supplier with ID "${id}" not found.`);
        }
        return supplier;
    }

    async getSupplierByName(name: string): Promise<Supplier> {
        let supplier = await this.suppliersRepo.findOne({name});

        if (!supplier){
            throw new NotFoundException(`Supplier named "${name}" not found.`);
        }
        return supplier;
    }

    addNewSupplier(supplierDto: SupplierDTO): Promise<Supplier> {
        return this.suppliersRepo.addNewSupplier(supplierDto);
    }

    async removeSupplier(filterDto: GetSuppliersFilterDto): Promise<any> {
        const { id, search } = filterDto;
        if (id) {
            const res = await this.suppliersRepo.delete(id);
            if (res.affected === 0){
                throw new NotFoundException(`Supplier with ID "${id}" not found.`);
            }
        }else{
            const res = await this.suppliersRepo.delete({name: search} );
            if (res.affected === 0){
                throw new NotFoundException(`Supplier named "${search}" not found.`);
            }
        }
        return 'Supplier deleted.';
    }

    async updateSupplier(id: number, supplierDto: SupplierDTO): Promise<Supplier>{
        const supplier = await this.getSupplierById(id.toString());

        const {name, country, city, streetAddress, type, notes} = supplierDto;

        if (typeof name !== undefined){
            const exists = !!(await this.suppliersRepo.findOne({name}));
            if(exists){
                throw new NotAcceptableException(`Supplier named "${supplierDto.name}" already exists.`);
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
