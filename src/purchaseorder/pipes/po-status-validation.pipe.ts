import { PipeTransform, BadRequestException } from '@nestjs/common';
import { POStatus } from "../purchaseorder.entity";

export class POStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        POStatus.OPEN,
        POStatus.SENT,
        POStatus.CANCELED,
    ];

    transform(value: any) {
        if (value) {
            value = value.toUpperCase();

            if (!this.isStatusValid(value)) {
                throw new BadRequestException(`"${value}" is an invalid status`);
            }
        }

        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}
