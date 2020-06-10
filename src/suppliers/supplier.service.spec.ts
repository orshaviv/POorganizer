import {Test} from "@nestjs/testing";
import {SupplierService} from "./supplier.service";
import {SupplierRepository} from "./supplier.repository";
import {SupplierTypeRepository} from "./supplier-type.repository";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {BadRequestException, NotFoundException} from "@nestjs/common";

const mockUser = {
    id: 1,
    username: 'TestUser'
};

const mockSupplierRepository = () => ({
    getSuppliers: jest.fn(),
    getSupplierById: jest.fn(),
    addNewSupplier: jest.fn(),
    delete: jest.fn(),
    updateSupplier: jest.fn()
});

const mockSupplierTypeRepository = () => ({

});

describe('SupplierService',() => {
    let supplierService;
    let supplierRepo;
    let supplierTypeRepo;

    //Reinitialize the service & repo before each test so each test case run independently.
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SupplierService,
                { provide: SupplierRepository, useFactory: mockSupplierRepository },
                { provide: SupplierTypeRepository, useFactory: mockSupplierTypeRepository }
            ],
        }).compile();

        supplierService = await module.get<SupplierService>(SupplierService);
        supplierRepo = await module.get<SupplierRepository>(SupplierRepository);
        supplierTypeRepo = await module.get<SupplierTypeRepository>(SupplierTypeRepository);
    });

    describe('getSuppliers', () => {
        it('gets all suppliers from the repository',async ()=> {
            supplierRepo.getSuppliers.mockResolvedValue('someValue');

            expect(supplierRepo.getSuppliers).not.toHaveBeenCalled();
            const filterDto: GetSuppliersFilterDto = {id: 1, search: 'query'};
            const result = await supplierService.getSuppliers(filterDto, mockUser);
            expect(supplierRepo.getSuppliers).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getSupplierById', () => {
       it('calls supplierRepo.getSupplierById() and successfully retrieve and return the supplier',async () => {
           const mockSupplier = { id: 1, name: 'Test supplier'};
           supplierRepo.getSupplierById.mockResolvedValue(mockSupplier);

           const result = await supplierService.getSupplierById(1, mockUser);
           expect(supplierRepo.getSupplierById).toHaveBeenCalledWith(1, mockUser);
           expect(result).toEqual(mockSupplier);
       });

       it('throws an error as supplier is not found',() => {
           supplierRepo.getSupplierById.mockResolvedValue(undefined);
           expect(supplierService.getSupplierById(1, mockUser)).rejects.toThrow(NotFoundException);
       });
    });

    describe('addNewSupplier', () => {
        it('calls supplierRepo.addNewSupplier() and returns the result',async () => {
            supplierRepo.addNewSupplier.mockResolvedValue({value: 'value'});

            expect(supplierRepo.addNewSupplier).not.toHaveBeenCalled();
            const mockSupplierDto = { id: 1, name: 'Test supplier', type: null };
            const result = await supplierService.addNewSupplier(mockSupplierDto, mockUser);
            expect(supplierRepo.addNewSupplier).toHaveBeenCalledWith(mockSupplierDto, null, mockUser);
            expect(result).toEqual({value: 'value'});
        });
    });

    describe('removeSupplier', () => {
        it('calls supplierRepo.removeSupplier() with an id field and returns the result',async () => {
            expect(supplierRepo.delete).not.toHaveBeenCalled();

            supplierRepo.delete.mockResolvedValue({ affected: 1 });
            const mockFilterDto = {id: 1, search: null};
            let result = await supplierService.removeSupplier(mockFilterDto, mockUser);
            expect(supplierRepo.delete).toHaveBeenCalledWith( {id: mockFilterDto.id, userId: mockUser.id});
            expect(result).toEqual(undefined);
        });

        it('calls supplierRepo.removeSupplier() with a search field and returns the result', async () => {
            supplierRepo.delete.mockResolvedValue({ affected: 1 });
            const mockFilterDto = {id: null, search: 'query'};
            const result = await supplierService.removeSupplier(mockFilterDto, mockUser);
            expect(supplierRepo.delete).toHaveBeenCalledWith( {name: mockFilterDto.search, userId: mockUser.id});
            expect(result).toEqual(undefined);
        });

        it('throws an error when supplier cannot be found',() => {
            expect(supplierRepo.delete).not.toHaveBeenCalled();

            supplierRepo.delete.mockResolvedValue({ affected: 0 });
            expect(supplierService.removeSupplier({id: 1, search: null}, mockUser)).rejects.toThrow(NotFoundException);
            expect(supplierService.removeSupplier({id: null, search: 'query'}, mockUser)).rejects.toThrow(NotFoundException);
        });

        it('throws an error when called with invalid query', () => {
            const mockFilterDto = { id: null, search: null };
            const result = supplierService.removeSupplier(mockFilterDto, mockUser);
            expect(supplierRepo.delete).not.toHaveBeenCalled();
            expect(result).rejects.not.toThrow(BadRequestException);
        });
    });

    describe('updateSupplier',() => {

    });
});
