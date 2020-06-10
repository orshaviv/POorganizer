import {EntityRepository, Not, Repository} from "typeorm";
import {Supplier} from "./supplier.entity";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {SupplierDTO} from "./dto/supplier.dto";
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    Logger,
    NotAcceptableException,
    NotFoundException
} from "@nestjs/common";
import {User} from "../auth/user.entity";
import {SupplierType} from "./supplier-type.entity";

@EntityRepository(Supplier)
export class SupplierRepository extends Repository<Supplier> {
    private logger = new Logger('SupplierRepository');

    async getSuppliers(
        filterDto: GetSuppliersFilterDto,
        user: User
    ): Promise<Supplier[]> {
        const {id, search} = filterDto;
        const query = this.createQueryBuilder('supplier').leftJoinAndSelect('supplier.type','type');

        query.where('supplier.userId = :userId', { userId: user.id })

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

        try {
            const suppliers = await query.getMany();
            return suppliers;
        } catch (error) {
            this.logger.error(`Failed to get suppliers for user ${user.firstName} ${user.lastName}. Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async addNewSupplier(
        supplierDto: SupplierDTO,
        supplierType: SupplierType,
        user: User
    ): Promise<Supplier> {
        let supplier = new Supplier();

        supplier.name = supplierDto.name;
        supplier.country = !supplierDto.country? null : supplierDto.country;
        supplier.city = !supplierDto.city? null : supplierDto.city;
        supplier.streetAddress = !supplierDto.streetAddress? null : supplierDto.streetAddress;
        supplier.type = !supplierType? null : supplierType;
        supplier.notes = !supplierDto.notes? null : supplierDto.notes;

        supplier.user = user;

        try{
            await supplier.save();
        }catch (error){
            if (error.code === 'ER_DUP_ENTRY') {
                this.logger.verbose(`Supplier named "${supplierDto.name}" already exists`, error.code);
                throw new ConflictException(`Supplier named "${supplierDto.name}" already exists.`);
            }
            this.logger.error(`Cannot add supplier`, error.stack);
            throw new InternalServerErrorException(`Cannot add supplier.`);
        }

        delete supplier.user;
        delete supplier.type.suppliers;
        return supplier;
    }

    async updateSupplier(
        supplierDto: SupplierDTO,
        supplierType: SupplierType,
        user: User
    ): Promise<Supplier> {
        let {id, name, country, city, streetAddress, type, notes} = supplierDto;

        if (!id) {
            throw new NotAcceptableException('Supplier ID is not specified.');
        }
        const supplier = await this.getSupplierById(id, user);

        if (!supplier) {
            throw new NotFoundException(`Supplier ID ${id} is not found.`);
        }

        if (name) {
            if(await this.findOne({ where: { name, userId: user.id, id: Not(id) } })){
                throw new ConflictException(`Supplier named "${supplierDto.name}" already exists.`);
            }
            supplier.name = name;
        }
        if (country){
            supplier.country = country;
        }
        if (city){
            supplier.city = city;
        }
        if (streetAddress){
            supplier.streetAddress = streetAddress;
        }
        if (supplierType){
            supplier.type = supplierType;
        }
        if (notes){
            supplier.notes = notes;
        }

        await supplier.save();

        delete supplier.user;
        delete supplier.type.suppliers;
        return supplier;
    }

    async getSupplierById(
        id: number,
        user: User,
    ): Promise<Supplier> {
        const query = await this.createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.type','type')
            .where('supplier.userId = :userId', { userId: user.id });

        query.andWhere('supplier.id = :id', { id });

        return query.getOne();
    }
}
