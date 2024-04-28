import env from "dotenv";
import http from 'http';
import { sequelize } from "./database/models/index";
import app from "./app";

env.config();
const port = process.env.PORT || 9010;

const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server started on", port);
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Database connection established successfully.💥"
    );
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
export default app;
