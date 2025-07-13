const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>{
    console.log("connected successfully");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};
const initDB=async()=>{
    await Listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj,owner:"686b997ce961b9965d47cc0d"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
};

initDB();