import { PipeTransform, BadRequestException } from '@nestjs/common';
import {PaymentStatus} from "../purchaseorder.entity";

export class PaymentStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        PaymentStatus.PAID,
        PaymentStatus.REFUND,
        PaymentStatus.PENDING,
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
