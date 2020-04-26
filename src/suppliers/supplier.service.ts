import {BadRequestException, Injectable, NotAcceptableException, NotFoundException} from "@nestjs/common";
import {Supplier} from "./supplier.interface";
import {Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";
import {SupplierDTO} from "./dto/supplier.dto";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private suppliersRepo: Repository<Supplier>,
    ) {}

    getAllSuppliers(): Promise<Supplier[]> {
        return this.suppliersRepo.find();
    }

    async getSuppliers(filterDto: GetSuppliersFilterDto): Promise<Supplier[]> {
        const {id, search} = filterDto;

        let suppliers = await this.getAllSuppliers();

        //id is unique -> results with only one supplier!
        if (id){
            suppliers = [suppliers.find(supplier => supplier.id.toString() === id)];
        }

        if (search){
            suppliers = suppliers.filter(supplier =>
                supplier.name.toUpperCase().includes(search.toUpperCase()) ||
                supplier.country.toUpperCase().includes(search.toUpperCase()) ||
                supplier.city.toUpperCase().includes(search.toUpperCase()) ||
                supplier.type.toUpperCase().includes(search.toUpperCase())
            );
        }

        return suppliers;
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

    async addNewSupplier(supplierDto: SupplierDTO): Promise<Supplier> {
        let suppliers = await this.getAllSuppliers();
        if (suppliers && suppliers.find(supplier => supplier.name === supplierDto.name)){
            throw new NotAcceptableException(`Supplier named "${supplierDto.name}" already exists.`);
        }

        let supplier = new Supplier();
        supplier.name = supplierDto.name;
        supplier.country = !supplierDto.country? null : supplierDto.country;
        supplier.city = !supplierDto.city? null : supplierDto.city;
        supplier.streetAddress = !supplierDto.streetAddress? null : supplierDto.streetAddress;
        supplier.type = !supplierDto.type? null : supplierDto.type;
        supplier.notes = !supplierDto.notes? null : supplierDto.notes;

        return await this.suppliersRepo.save(supplier);
    }

    async removeSupplier(filterDto: GetSuppliersFilterDto) {
        let supplierToRemove: Supplier;
        if (filterDto.id) {
            supplierToRemove = await this.getSupplierById(filterDto.id);
        }else{
            supplierToRemove = await this.getSupplierByName(filterDto.search);
        }
        return await this.suppliersRepo.remove(supplierToRemove);
    }
}
