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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./connection/data-source");
const axios_1 = __importDefault(require("axios"));
const validateEmail_service_1 = __importDefault(require("./services/validateEmail.service"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 4000;
const ADMIN_URL = process.env.ADMIN_URL;
app.post("/save-admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, role_id, referenceTypeId, contactNumber, gender, adminType, status, } = req.body.input;
        if (!firstName ||
            !lastName ||
            !email ||
            !role_id ||
            !referenceTypeId ||
            !adminType) {
            return res.status(400).json({ message: "missing value" });
        }
        if (!validateEmail_service_1.default.isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const graphqlPayload = {
            operationName: "SaveAdminV2",
            variables: {
                input: {
                    adminType: adminType,
                    contactNumber: contactNumber,
                    email: email,
                    firstName: firstName,
                    gender: gender,
                    lastName: lastName,
                    referenceTypeId: [referenceTypeId],
                    roles: role_id,
                    status: status,
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
        const token = req.headers["authorization"];
        const response = yield axios_1.default.post(ADMIN_URL, graphqlPayload, {
            headers: {
                "Accept-Language": "en-US,en;q=0.9",
                Connection: "keep-alive",
                Origin: "https://dev-admin.allupfitness.com",
                Referer: "https://dev-admin.allupfitness.com",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                Accept: "*/*",
                Authorization: `${token}`,
                "Content-Type": "application/json",
                "sec-ch-ua": `"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"`,
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": `"Windows"`,
                source: "admin",
                "x-app-source": "ADMIN_PLATFORM",
            },
        });
        const data = response.data;
        console.log(data, "data");
        return res.status(200).json(data);
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
