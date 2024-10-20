import express from "express";
import helmet from "helmet";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import routes from "./routes/router";
import LicenseModel from "./models/license";

const uri = process.env.DB_URL as string;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

const app = express();
app.use(express.urlencoded({ extended: true, limit: "2mb"}));
app.use(express.json({ limit: "2mb" }));
app.use(cors());
app.use(helmet());

app.listen(process.env.PORT || 5050, async () => {
    let dbConnected = false;
    try {
        // await connect(uri, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
        await client.connect();
        await client.db("test").command({ ping: 1 });
        console.log("Conectado ao banco de dados.");
        dbConnected = true;
    } catch (error: any) {
        console.log("Erro ao se conectar ao banco de dados: ", error, error?.stack)
        dbConnected = false;
    }
    if (dbConnected) {
        app.use("/", routes(client));
        console.log(`Ativo em ${process.env.PORT || 5050}`);
    } else {
        app.use("*", (_, res) => {
            res.status(500).json({
                message: "Database offline"
            });
        });
        console.log("Database offline");
    }

});