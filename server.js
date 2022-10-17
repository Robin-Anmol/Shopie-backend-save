const app = require("./app");
const dotEnv = require("dotenv");
const MongoDbConnect = require("./config/Database");

//uncaught exception
process.on("uncaughtException", (error) => {
  console.log(`Error :${error.message}`);
  console.log("server is shutting down due to uncaught exceptions");
  process.exit(1);
});

dotEnv.config({ path: "key.env" });
MongoDbConnect();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error :${err.message}`);
  console.log(`Server is shutting down due to unhandled promise rejection `);
  server.close(() => {
    process.exit(1);
  });
});
