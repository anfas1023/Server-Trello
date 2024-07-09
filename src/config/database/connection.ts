import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url=process.env.MONGO_URL
console.log(url);

if(!url){
    throw new Error("No Connection between databse take place");
}

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb+srv://anfasmuhammed936:anfasmuhammed8590@cluster0.6hcxbof.mongodb.net/", {
      dbName: "Work-way",
    });
    console.log("databse connected sucessfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDatabase;
