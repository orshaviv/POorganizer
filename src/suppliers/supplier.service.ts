import {Injectable} from "@nestjs/common";
import {Supplier} from "./supplier.interface";
import {Repository} from "typeorm";

import {InjectRepository} from "@nestjs/typeorm";
import {SupplierDTO} from "./supplier.dto";

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private suppliersRepo: Repository<Supplier>,
    ) {}

    welcomeScreen() {
        return 'Welcome to suppliers screen. For all suppliers go to /suppliers/all. ';
    }

    getAllSuppliers(): Promise<Supplier[]> {
        return this.suppliersRepo.find();
    }

    getSupplierById(id: number): Promise<Supplier> {
        return this.suppliersRepo.findOne(id);
    }

    getSupplierByName(supplierName: string): Promise<Supplier> {
        return this.suppliersRepo.findOne( {where: {name: supplierName} });
    }

    findSupplier(supplier: {name: string, id: number}): Promise<Supplier> {
        return this.suppliersRepo.findOne( {
            where: [
                {name: supplier.name},
                {id: supplier.id}
            ]
        });
    }

    addSupplier(supplierDTO: SupplierDTO): Promise<Supplier> {
        let supplier = new Supplier();
        supplier.name = supplierDTO.name;
        supplier.country = supplierDTO.country;
        supplier.city = supplierDTO.city;
        supplier.streetAddress = supplierDTO.streetAddress;
        supplier.type = supplierDTO.type;
        supplier.notes = supplierDTO.notes;

        return this.suppliersRepo.save(supplier);
    }

    async removeSupplier(supplierToRemove: Supplier) {
        return await this.suppliersRepo.remove(supplierToRemove);
    }
}
