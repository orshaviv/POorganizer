import {BadRequestException} from "@nestjs/common";

export function userImageFileFilter (req, file, cb) {
    if (file.mimetype != 'image/png' && file.mimetype != 'image/jpeg') {
        req.fileValidationError = 'Invalid file type';
        return cb(new BadRequestException('Invalid file type'), false);
    }

    return cb(null, true);
}
