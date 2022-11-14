const fs=require("fs");
const mongoose=require("mongoose");
const colors=require("colors")
const dotenv=require("dotenv")


//load env config
dotenv.config({path:'./config/config.env'})
const Bootcamp = require("./models/Bootcamp");
//connect mongodb
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  
});

//read json file
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamp.json`,'utf-8'))

//import data into db
const importData=async()=>{
    try {
        await Bootcamp.create(bootcamps);
        console.log("data imported...".green.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
   
}

//delete data

const deleteData=async()=>{
    try {
        await Bootcamp.deleteMany();
        console.log("data deleted...".red.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
   
}

if(process.argv[2]==="-i"){
    importData()
}else if(process.argv[2]==="-d"){
    deleteData()
}