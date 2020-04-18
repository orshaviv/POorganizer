import {BadRequestException, Injectable} from "@nestjs/common";
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

    findSupplier(supplier: SupplierDTO): Promise<Supplier> {
        return this.suppliersRepo.findOne( {
            where: [
                {name: supplier.name},
                {id: supplier.id}
            ]
        });
    }

    addSupplier(supplierDTO: SupplierDTO): Promise<Supplier> {
        return this.findSupplier(supplierDTO).then(res => {
            if (!res){
                let supplier = new Supplier();
                supplier.name = supplierDTO.name;
                supplier.country = supplierDTO.country;
                supplier.city = supplierDTO.city;
                supplier.streetAddress = supplierDTO.streetAddress;
                supplier.type = supplierDTO.type;
                supplier.notes = supplierDTO.notes;

                return this.suppliersRepo.save(supplier);
            }
            throw new BadRequestException('supplier with id or name already exist.');
        }).catch(err => {
            throw err;
        });
    }

    removeSupplier(supplierDTO: SupplierDTO) {
        return this.findSupplier(supplierDTO).then(supplierToRemove => {
            if (!supplierToRemove){
                throw new BadRequestException('supplier with id or name does not exist.');
            }
            return this.suppliersRepo.remove(supplierToRemove);
        }).catch(err => {
            throw err;
        });
    }
}
