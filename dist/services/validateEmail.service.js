"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmailValidationService {
    static isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }
}
exports.default = EmailValidationService;
