import fs from "fs"
import mongoose from "mongoose"
import { config } from "dotenv"
config({ path: './utilities/.env' });
import Exam from "../../model/questionModel.js"
const DB = process.env.DATABASE;
console.log('Database URL:', DB);
//Connect to the database
mongoose.connect(DB, {    
}).then(() => {
    console.log("DB is connected successfully");
}).catch((err) => {
    console.error('Error connecting to DB:', err);
});
//start the server

const questions = JSON.parse(fs.readFileSync("./school/dev-data/question.json", "utf-8"));
const importSchoolData = async()=>{
    try {
         await Exam.create(questions);
         console.log("schoolData is successfully loaded into mongoDb database")
         process.exit()    
    } catch (error) {
        console.log(error)
    }
}

const deleteSchoolData = async () => {
    try {
         await Exam.deleteMany();
         console.log("schoolData is successfully deleted into mongoDb database")
         process.exit()    
    } catch (error) {
        console.log(error)
    }
}

if(process.argv[2] === "--import"){
    importSchoolData();
}
else if (process.argv[2] === "--delete"){
    deleteSchoolData();
}


console.log(process.argv)