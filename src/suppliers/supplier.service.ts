import {BadRequestException, Injectable, NotAcceptableException, NotFoundException} from "@nestjs/common";
import {Supplier} from "./supplier.entity";
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

    async getSupplierById(id: number): Promise<Supplier> {
        let supplier = await this.suppliersRepo.findOne({ id });

        if (!supplier){
            throw new NotFoundException(`Supplier with ID "${id}" not found.`);
        }
        return supplier;
    }

    async getSupplierByName(name: string): Promise<Supplier> {
        let supplier = await this.suppliersRepo.findOne({ name });

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

    updateSupplier(supplierDto: SupplierDTO): Promise<Supplier>{
        return this.suppliersRepo.updateSupplier(supplierDto);
    }
}
