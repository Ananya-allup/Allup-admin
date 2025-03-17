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
const validateEmail_service_1 = __importDefault(require("./services/validateEmail.service"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 4011;
// app.post("/save-admin", async (req: Request, res: Response) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       role_id,
//       referenceTypeId,
//       contactNumber,
//       gender,
//       adminType,
//       status,
//     } = req.body.input;
//     console.log(
//       firstName,
//       lastName,
//       email,
//       role_id,
//       referenceTypeId,
//       contactNumber,
//       gender,
//       adminType,
//       status
//     );
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !role_id ||
//       !referenceTypeId ||
//       !adminType
//     ) {
//       res.status(400).json({ message: "missing value" });
//     }
//     console.log("Request Body Input:", req.body.input);
//     if (!EmailValidationService.isValidEmail(email)) {
//       res.status(400).json({ message: "Invalid email format" });
//     }
//     // Check if the email already exists in the Admin table
//     const existingAdmin = await Admin.findOne({ where: { email } });
//     if (existingAdmin) {
//       res.status(400).json({ message: "Email is already in use" });
//     }
//     const role = await Role.findOne({ where: { id: role_id } });
//     if (!role) {
//       res.status(400).json({ message: "Role not found" });
//     }
//     const adminPass = PasswordService.generateRandomPassword();
//     console.log("password", adminPass);
//     const newAdmin = new Admin();
//     newAdmin.firstName = firstName;
//     newAdmin.lastName = lastName;
//     newAdmin.email = email;
//     newAdmin.contactNumber = contactNumber || null;
//     newAdmin.gender = gender || "ANY";
//     newAdmin.status = status || "ACTIVE";
//     newAdmin.adminType = adminType;
//     newAdmin.referenceTypeId = referenceTypeId;
//     newAdmin.role = role_id;
//     newAdmin.password = adminPass;
//     const savedAdmin = await newAdmin.save();
//     res.status(200).json({
//       data: {
//         saveAdminV2: {
//           admin: {
//             id: newAdmin.id,
//           },
//           password: newAdmin.password,
//           error: null,
//           errors: [],
//           errorMessage: null,
//         },
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving admin", error });
//   }
// });
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
const axios_1 = __importDefault(require("axios"));
app.post("/save-admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, role_id, referenceTypeId, contactNumber, gender, adminType, status, } = req.body.input;
        console.log(req.body.input, "body");
        if (!firstName ||
            !lastName ||
            !email ||
            !role_id ||
            !referenceTypeId ||
            !adminType) {
            console.log(firstName, lastName, email, role_id, referenceTypeId, adminType);
            return res.status(400).json({ message: "missing value" });
        }
        // Validate Email format (assuming you have a validation service)
        if (!validateEmail_service_1.default.isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        // Prepare the GraphQL request payload
        const graphqlPayload = {
            operationName: "SaveAdminV2",
            variables: {
                input: {
                    // firstName,
                    // lastName,
                    // email,
                    // contactNumber,
                    // gender: gender || "ANY",
                    // status: status || "ACTIVE",
                    // adminType,
                    // roles: role_id,
                    // referenceTypeId: [referenceTypeId],
                    adminType: adminType,
                    contactNumber: contactNumber,
                    email: email,
                    firstName: firstName,
                    gender: gender,
                    lastName: lastName,
                    referenceTypeId: [referenceTypeId],
                    roles: role_id,
                    status: status
                },
            },
            query: `
        mutation SaveAdminV2($input: SaveAdminV2Input!) {
          saveAdminV2(input: $input) {
            admin {
              id
            }
            password
            error
            errors
            errorMessage
          }
        }
      `,
        };
        const token = req.headers['authorization'];
        console.log(graphqlPayload, "graphqlPayload");
        // Send the GraphQL request using Axios
        const response = yield axios_1.default.post("https://dev-api.allupfitness.com/graphql", graphqlPayload, {
            headers: {
                "Accept-Language": "en-US,en;q=0.9",
                "Connection": "keep-alive",
                "Origin": "https://dev-admin.allupfitness.com",
                "Referer": "https://dev-admin.allupfitness.com",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "Accept": "*/*",
                "Authorization": `${token}`,
                "Content-Type": "application/json",
                "sec-ch-ua": `"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"`,
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": `"Windows"`,
                "source": "admin",
                "x-app-source": "ADMIN_PLATFORM",
            },
        });
        // Handle the response from the external API
        const data = response.data;
        console.log(data, "data");
        return res.status(200).json(data);
        // Return the response data back to the client
        return res.status(200).json({
            data: {
                saveAdminV2: {
                    admin: {
                        id: data.data.saveAdminV2.admin.id,
                    },
                    password: data.data.saveAdminV2.password,
                    error: data.data.saveAdminV2.error,
                    errors: data.data.saveAdminV2.errors,
                    errorMessage: data.data.saveAdminV2.errorMessage,
                },
            },
        });
    }
    catch (error) {
        console.error("Error calling GraphQL API:", error);
        return res.status(500).json({ message: "Error saving admin", error });
    }
}));
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
