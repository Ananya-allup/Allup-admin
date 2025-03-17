import dotenv from "dotenv";
dotenv.config(); 
import express, { Request, Response } from "express";
import { AppDataSource } from "./connection/data-source";
import axios from "axios";
import EmailValidationService from "./services/validateEmail.service";
const app = express();
app.use(express.json());


const PORT = process.env.PORT || 4000;
const ADMIN_URL= process.env.ADMIN_URL;


app.post("/save-admin", async (req: Request, res: Response): Promise<any> => {
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

    if (
      !firstName ||
      !lastName ||
      !email ||
      !role_id ||
      !referenceTypeId ||
      !adminType
    ) {

      return res.status(400).json({ message: "missing value" });
    }

    if (!EmailValidationService.isValidEmail(email)) {
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

    const response = await axios.post(
      ADMIN_URL,
      graphqlPayload,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "keep-alive",
          Origin: "https://dev-admin.allupfitness.com",
          Referer: "https://dev-admin.allupfitness.com",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "*/*",
          Authorization: `${token}`,
          "Content-Type": "application/json",
          "sec-ch-ua": `"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"`,
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": `"Windows"`,
          source: "admin",
          "x-app-source": "ADMIN_PLATFORM",
        },
      }
    );

    const data = response.data;
    console.log(data, "data");
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error calling GraphQL API:", error);
    return res.status(500).json({ message: "Error saving admin", error });
  }
});

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
