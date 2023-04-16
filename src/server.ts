import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import Routes from "./routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(Routes);

app.listen(process.env.PORT, () => {
  console.log(`Rodando na porta ${process.env.PORT}`);
});
