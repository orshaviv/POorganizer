import {BadRequestException, Injectable, NotAcceptableException, NotFoundException} from "@nestjs/common";
import {Supplier} from "./supplier.entity";
import {Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";
import {SupplierDTO} from "./dto/supplier.dto";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {SupplierRepository} from "./supplier.repository";
import {User} from "../auth/user.entity";

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(SupplierRepository)
        private suppliersRepo: SupplierRepository,
    ) {}

    getSuppliers(
        filterDto: GetSuppliersFilterDto,
        user: User
    ): Promise<Supplier[]> {
        return this.suppliersRepo.getSuppliers(filterDto, user);
    }

    async getSupplierById(
        id: number,
        user: User,
        ): Promise<Supplier> {
        let supplier = await this.suppliersRepo.findOne({where: { id, userId: user.id }} );

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

    addNewSupplier(
        supplierDto: SupplierDTO,
        user: User
    ): Promise<Supplier> {
        return this.suppliersRepo.addNewSupplier(supplierDto, user);
    }

    async removeSupplier(
        filterDto: GetSuppliersFilterDto,
        user: User,
    ): Promise<any> {
        const { id, search } = filterDto;
        if (id) {
            const res = await this.suppliersRepo.delete({id, userId: user.id});
            if (res.affected === 0){
                throw new NotFoundException(`Supplier with ID "${id}" not found.`);
            }
        }else{
            const res = await this.suppliersRepo.delete({name: search, userId: user.id} );
            if (res.affected === 0){
                throw new NotFoundException(`Supplier named "${search}" not found.`);
            }
        }
        return 'Supplier deleted.';
    }

    updateSupplier(
        supplierDto: SupplierDTO,
        user: User,
    ): Promise<Supplier>{
        return this.suppliersRepo.updateSupplier(supplierDto, user);
    }
}
