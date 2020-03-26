import {HttpException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Supplier} from "./supplier.interface";
import {Repository} from "typeorm";
import {SupplierDTO} from "./supplier.dto";

@Injectable()
export class SupplierService {
    constructor(@InjectRepository(Supplier) private repo: Repository<Supplier>) {
    }

    welcomeScreen() {
        return 'Welcome to suppliers screen. For all suppliers go to /suppliers/all. ';
    }

    async getAllSuppliers() {
        return await this.repo.find({});
    }

    async getSupplierById(id: number) {
        let supplier = await this.repo.findOne(id);
        if (!supplier){
            console.log('Supplier service: Supplier not found');
        }
        return supplier;
    }

    async getSupplierByName(name: string) {
        let supplier = await this.repo.findOne({supplierName: name});
        if (!supplier){
            console.log('Supplier service: Supplier not found');
        }
        return supplier;
    }

    async addSupplier(supplierDTO: SupplierDTO) {
        if (supplierDTO.name.length <= 45){
            let result = await this.repo.findOne({supplierName: supplierDTO.name});
            if (result){
                throw new HttpException('Supplier already exists', 422);
            }
        }else{
            throw new HttpException('Wrong input',422);
        }
        let supplier = new Supplier();
        supplier.supplierName = supplierDTO.name;
        supplier.country = supplierDTO.country;
        supplier.city = supplierDTO.city;
        supplier.streetAddress = supplierDTO.streetAddress;
        supplier.classify = supplierDTO.classify;
        supplier.notes = supplierDTO.notes;
        
        return await this.repo.save(supplier).then(res => res);
    }

    async removeSupplier(name: string) {
        let supplierToRemove = await this.repo.findOne({supplierName: name});

        if (supplierToRemove) {
            await this.repo.remove(supplierToRemove);
            throw new HttpException('Supplier has been removed', 200);
        }
        throw new HttpException('Supplier name not found', 422);
    }
}
