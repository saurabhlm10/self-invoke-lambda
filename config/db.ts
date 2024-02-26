import mongoose from "mongoose";
import { ENV } from "../constants";

const connectToDb = async () => {
  return mongoose
    .connect(ENV.MONGO_URL)
    .then((conn) => {
      console.log(`connected to db at ${conn.connection.host}`);
    })
    .catch((error) => {
      console.log(error.message, "wrong password");
      process.exit(1);
    });
};

export default connectToDb;
