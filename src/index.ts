import express, { Request, Response } from "express";
import { AppDataSource } from "./connection/data-source";
import { Admin } from "./entity/admin";
import { Role } from "./entity/role";
import { validate as uuidValidate } from "uuid";
import PasswordService from "./services/passwordGeneration.service";
import EmailValidationService from "./services/validateEmail.service";
const app = express();
app.use(express.json());

const PORT = 4011;

app.post("/save-admin", async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      role_id,
      referenceTypeId,
      contactNumber,
      gender,
      adminType,
      status,
    } = req.body.input;
    console.log(
      firstName,
      lastName,
      email,
      role_id,
      referenceTypeId,
      contactNumber,
      gender,
      adminType,
      status
    );

    if (
      !firstName ||
      !lastName ||
      !email ||
      !role_id ||
      !referenceTypeId ||
      !adminType
    ) {
      res.status(400).json({ message: "missing value" });
    }
    console.log("Request Body Input:", req.body.input);

    if (!EmailValidationService.isValidEmail(email)) {
      res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the email already exists in the Admin table
    const existingAdmin = await Admin.findOne({ where: { email } });

    if (existingAdmin) {
      res.status(400).json({ message: "Email is already in use" });
    }

    const role = await Role.findOne({ where: { id: role_id } });
    if (!role) {
      res.status(400).json({ message: "Role not found" });
    }

    const adminPass = PasswordService.generateRandomPassword();
    console.log("password", adminPass);

    const newAdmin = new Admin();
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

    const savedAdmin = await newAdmin.save();

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
  } catch (error) {
    res.status(500).json({ message: "Error saving admin", error });
  }
});

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

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.log("Error during Data Source initialization:", error);
  });
