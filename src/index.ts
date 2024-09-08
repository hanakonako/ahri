import express from "express";
import helmet from "helmet";
import cors from "cors";
import { connect } from "mongoose";
import router from "./routes/router";

const app = express();
app.use(express.urlencoded({ extended: true, limit: "2mb"}));
app.use(express.json({ limit: "2mb" }));
app.use(cors());
app.use(helmet());

app.listen(process.env.PORT || 5050, async () => {
    const uri = process.env.DB_URL as string;
    try {
        await connect(uri, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
        app.use("/", router);
        console.log("Conectado ao banco de dados.");
    } catch (error: any) {
        router.get("/ping", (_, res) => {
            res.status(500).json({
                message: "Database down"
            });
        });
        console.log("Erro ao se conectar ao banco de dados: ", error, error?.stack)
    }
    console.log(`Ativo em ${process.env.PORT || 5050}`);
});