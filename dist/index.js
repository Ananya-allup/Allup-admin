"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./connection/data-source");
const admin_1 = require("./entity/admin");
const role_1 = require("./entity/role");
const passwordGeneration_service_1 = __importDefault(require("./services/passwordGeneration.service"));
const validateEmail_service_1 = __importDefault(require("./services/validateEmail.service"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 4011;
app.post("/save-admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, role_id, referenceTypeId, contactNumber, gender, adminType, status, } = req.body.input;
        console.log(firstName, lastName, email, role_id, referenceTypeId, contactNumber, gender, adminType, status);
        if (!firstName ||
            !lastName ||
            !email ||
            !role_id ||
            !referenceTypeId ||
            !adminType) {
            res.status(400).json({ message: "missing value" });
        }
        console.log("Request Body Input:", req.body.input);
        if (!validateEmail_service_1.default.isValidEmail(email)) {
            res.status(400).json({ message: "Invalid email format" });
        }
        // Check if the email already exists in the Admin table
        const existingAdmin = yield admin_1.Admin.findOne({ where: { email } });
        if (existingAdmin) {
            res.status(400).json({ message: "Email is already in use" });
        }
        const role = yield role_1.Role.findOne({ where: { id: role_id } });
        if (!role) {
            res.status(400).json({ message: "Role not found" });
        }
        const adminPass = passwordGeneration_service_1.default.generateRandomPassword();
        console.log("password", adminPass);
        const newAdmin = new admin_1.Admin();
        newAdmin.firstName = firstName;
        newAdmin.lastName = lastName;
        newAdmin.email = email;
        newAdmin.contactNumber = contactNumber || null;
        newAdmin.gender = gender || "ANY";
        newAdmin.status = status || "ACTIVE";
        newAdmin.adminType = adminType;
        newAdmin.referenceTypeId = referenceTypeId;
        newAdmin.role = role_id;
        newAdmin.password = adminPass;
        const savedAdmin = yield newAdmin.save();
        res.status(200).json({
            data: {
                saveAdminV2: {
                    admin: {
                        id: newAdmin.id,
                    },
                    password: newAdmin.password,
                    error: null,
                    errors: [],
                    errorMessage: null,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error saving admin", error });
    }
}));
// app.post('/save-admin', async (req: Request, res: Response) => {
//     const {firstName, lastName, email, roleId} = req.body.input;
//     try {
//         console.log("Request Body Input:", req.body.input);
//       const   adminRepository = AppDataSource.getRepository(Admin);
//       console.log("adminRepository:", adminRepository);
//       const newAdmin = adminRepository.create(req.body.input);
//         console.log("newAdmin: " , newAdmin);
//       await adminRepository.save(newAdmin);
//       res.status(200).json({"data": {
//         "saveAdminV2": {
//             "admin": {
//                 "id": newAdmin
//             },
//             "password": "6d678198",
//             "error": null,
//             "errors": [],
//             "errorMessage": null
//         }
//     }
// });
//     } catch (error) {
//       res.status(500).json({ message: 'Error saving admin', error });
//     }
//   });
app.listen(PORT, () => {
    console.log("Server running on PORT: " + PORT);
});
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((error) => {
    console.log("Error during Data Source initialization:", error);
});
