import {BadRequestException, Injectable, Logger, NotFoundException} from "@nestjs/common";
import {Supplier} from "./supplier.entity";
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
    private logger = new Logger('SupplierService');

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
        const supplier = await this.suppliersRepo.getSupplierById(id, user);

        this.logger.verbose(`Supplier found: ${ JSON.stringify(supplier) }`);
        if (!supplier){
            throw new NotFoundException(`Supplier with ID ${ id } not found.`);
        }
        return supplier;
    }

    async getSupplierByName(
        name: string,
        user: User
    ): Promise<Supplier> {
        const supplier = await this.suppliersRepo.getSupplierByName(name, user);

        if (!supplier){
            throw new NotFoundException(`Supplier named "${ name }" not found.`);
        }
        return supplier;
    }

    async addNewSupplier(
        supplierDto: SupplierDTO,
        user: User
    ): Promise<Supplier> {
        let supplierTypes: SupplierType[] = [];
        if(supplierDto.types){
            supplierTypes = await this.supplierTypeRepository.createOrFindSupplierType(supplierDto.types);
        }
        return await this.suppliersRepo.addNewSupplier(supplierDto, supplierTypes, user);
    }

    async removeSupplier(
        id: number,
        user: User,
    ): Promise<void> {
        const res = await this.suppliersRepo.delete({id, userId: user.id});
        if (res.affected === 0){
            throw new NotFoundException(`Supplier with ID "${id}" not found.`);
        }
    }

    async updateSupplier(
        supplierDto: SupplierDTO,
        user: User,
    ): Promise<Supplier>{
        let supplierTypes: SupplierType[] = [];
        if(supplierDto.types){
            supplierTypes = await this.supplierTypeRepository.createOrFindSupplierType(supplierDto.types);
        }else{
            supplierTypes = null;
        }
        return await this.suppliersRepo.updateSupplier(supplierDto, supplierTypes, user);
    }

    findTypes(
        getSuppliersTypesFilterDto: GetSuppliersTypesFilterDto,
    ): Promise<SupplierType[]> {
        return this.supplierTypeRepository.getTypes(getSuppliersTypesFilterDto);
    }
}
