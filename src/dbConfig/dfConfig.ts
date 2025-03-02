import mongoose from "mongoose"


export async function dbconnect() {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/UserDb")
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("MongoDB connected");

        })
        connection.on('error', (err) => {
            console.log("Mongo DB connection error,please make sure db is on" + err);
            process.exit();
        })

    } catch (error) {
        console.log("Error in conecting DB");
        console.log(error);


    }
}