import {BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {Supplier} from "./supplier.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {SupplierDTO} from "./dto/supplier.dto";
import {SupplierRepository} from "./supplier.repository";
import {User} from "../auth/user.entity";
import {SupplierTypeRepository} from "./supplier-type.repository";
import {SupplierType} from "./supplier-type.entity";
import {PurchaseOrderDto} from "../purchaseorder/dto/purchase-order.dto";

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
        search: string,
        user: User
    ): Promise<Supplier[]> {
        return this.suppliersRepo.getSuppliers(search, user);
    }

    async getSupplierById(
        id: number,
        user: User,
    ): Promise<Supplier> {
        const supplier = await this.suppliersRepo.getSupplierById(id, user);

        this.logger.verbose(`Supplier found: ${ JSON.stringify(supplier) }`);
        return supplier;
    }

    async getSupplierByName(
        name: string,
        user: User
    ): Promise<Supplier> {
        const supplier = await this.suppliersRepo.getSupplierByName(name, user);

        this.logger.verbose(`Supplier found: ${ JSON.stringify(supplier) }`);
        return supplier;
    }

    async addSupplier(
        supplierDto: SupplierDTO,
        user: User
    ): Promise<Supplier> {
        let supplierTypes: SupplierType[] = [];
        if(supplierDto.types){
            supplierTypes = await this.supplierTypeRepository.createOrFindSupplierType(supplierDto.types);
        }
        return await this.suppliersRepo.addSupplier(supplierDto, supplierTypes, user);
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
        id: number,
        supplierDto: SupplierDTO,
        user: User,
    ): Promise<Supplier>{
        let supplierTypes: SupplierType[] = [];
        if(supplierDto.types){
            supplierTypes = await this.supplierTypeRepository.createOrFindSupplierType(supplierDto.types);
        }else{
            supplierTypes = null;
        }
        supplierDto.id = id;
        return await this.suppliersRepo.updateSupplier(supplierDto, supplierTypes, user);
    }

    async getOrCreateSupplier(
        supplierDto: SupplierDTO,
        user: User
    ): Promise<Supplier> {
        const { id: supplierId, name: supplierName } = supplierDto;

        if (!supplierId && !supplierName) {
            throw new BadRequestException('Specify supplier ID or name.');
        }

        let supplier: Supplier;

        if (supplierId) {
            this.logger.log('Find supplier by ID.');
            supplier = await this.getSupplierById(supplierId, user);
        }

        if (!supplier && supplierName){
            this.logger.log('Find supplier by name.');
            supplier = await this.getSupplierByName(supplierName, user);
        }

        if (!supplier && supplierName) {
            this.logger.log('Creating new supplier.');
            let supplierDto = new SupplierDTO();
            supplierDto.name = supplierName;
            supplier = await this.addSupplier(supplierDto, user);
        }

        if (!supplier) {
            throw new InternalServerErrorException('Cannot find or create supplier.');
        }

        return supplier;
    }

    getTypes(
        search: string
    ): Promise<SupplierType[]> {
        return this.supplierTypeRepository.getTypes(search);
    }

    getTypeById(
        id: number
    ): Promise<SupplierType> {
        return this.supplierTypeRepository.findOne({ id });
    }
}
