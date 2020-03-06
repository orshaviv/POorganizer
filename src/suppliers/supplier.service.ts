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

    async addSupplier(supplierDTO: SupplierDTO) {
        if (supplierDTO.name.length <= 45){
            let result = await this.repo.findOne({supplier_name: supplierDTO.name});
            if (result){
                throw new HttpException('Supplier already exists', 422);
            }
        }else{
            throw new HttpException('Wrong input',422);
        }

        let supplier = new Supplier();
        supplier.supplier_name = supplierDTO.name;

        await this.repo.save(supplier);
        throw new HttpException('Supplier has been added', 200);
    }

    async removeSupplier(name: string) {
        let supplierToRemove = await this.repo.findOne({supplier_name: name});

        if (supplierToRemove) {
            await this.repo.remove(supplierToRemove);
            throw new HttpException('Supplier has been removed', 200);
        }
        throw new HttpException('Supplier name not found', 422);
    }
}