import {BadRequestException, Injectable, NotAcceptableException, NotFoundException} from "@nestjs/common";
import {Supplier} from "./supplier.entity";
import {Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";
import {SupplierDTO} from "./dto/supplier.dto";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {SupplierRepository} from "./supplier.repository";
import {User} from "../auth/user.entity";
import {SupplierTypeRepository} from "./supplier-type.repository";
import {SupplierType} from "./supplier-type.entity";
import {GetSuppliersTypesFilterDto} from "./dto/get-suppliers-types-filter.dto";

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(SupplierRepository)
        private suppliersRepo: SupplierRepository,
        @InjectRepository(SupplierTypeRepository)
        private supplierTypeRepository: SupplierTypeRepository,
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

        const query = await this.suppliersRepo.createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.type','type')
            .where('supplier.id = :id', { id });

        const supplier = query.getOne();

        if (!supplier){
            throw new NotFoundException(`Supplier with ID "${id}" not found.`);
        }
        return supplier;
    }

    async getSupplierByName(name: string): Promise<Supplier> {

        const query = await this.suppliersRepo.createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.type','type')
            .where('supplier.name = :name', {name});

        const supplier = query.getOne();

        if (!supplier){
            throw new NotFoundException(`Supplier named "${name}" not found.`);
        }
        return supplier;
    }

    async addNewSupplier(
        supplierDto: SupplierDTO,
        user: User
    ): Promise<Supplier> {

        let supplierType: SupplierType = null;
        if(supplierDto.type){
            supplierType = await this.supplierTypeRepository.createOrUpdateSupplierType(supplierDto.type);
        }
        return await this.suppliersRepo.addNewSupplier(supplierDto, supplierType, user);
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

    async updateSupplier(
        supplierDto: SupplierDTO,
        user: User,
    ): Promise<Supplier>{
        let supplierType: SupplierType = null;
        if(supplierDto.type){
            supplierType = await this.supplierTypeRepository.createOrUpdateSupplierType(supplierDto.type);
        }
        return await this.suppliersRepo.updateSupplier(supplierDto, supplierType, user);
    }

    findTypes(
        getSuppliersTypesFilterDto: GetSuppliersTypesFilterDto,
        ): Promise<SupplierType[]> {
        return this.supplierTypeRepository.getTypes(getSuppliersTypesFilterDto);
    }
}
