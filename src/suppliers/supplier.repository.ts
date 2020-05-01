import {EntityRepository, Repository} from "typeorm";
import {Supplier} from "./supplier.entity";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {SupplierDTO} from "./dto/supplier.dto";
import {ConflictException, NotAcceptableException, NotFoundException} from "@nestjs/common";
import {User} from "../auth/user.entity";
import {SupplierType} from "./supplier-type.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../auth/user.repository";
import {SupplierTypeRepository} from "./supplier-type.repository";

@EntityRepository(Supplier)
export class SupplierRepository extends Repository<Supplier> {
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

        const suppliers = await query.getMany();
        return suppliers;
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
            console.log('Supplier Added.');
        }catch (error){
            throw new ConflictException(`Supplier named "${supplierDto.name}" already exists.`);
        }

        delete supplier.user;
        return supplier;
    }

    async updateSupplier(
        supplierDto: SupplierDTO,
        supplierType: SupplierType,
        user: User
    ): Promise<Supplier> {
        const {id, name, country, city, streetAddress, type, notes} = supplierDto;

        if (!id) {
            throw new NotAcceptableException('Supplier ID is not specified.');
        }
        const supplier = await this.findOne({ where: {id, userId: user.id}}); //getSupplierById(id);

        if (!supplier) {
            throw new NotFoundException(`Supplier with ID "${id}" not found.`);
        }

        if (name) {
            const exists = await this.findOne({ where: { name, userId: user.id}});
            if(exists){
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
        return supplier;
    }

}
