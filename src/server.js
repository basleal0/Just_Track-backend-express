import express from 'express'
import habitRoutes from './routes/habitRoutes.js'



const app=express();
app.use("/habits", habitRoutes)


const PORT=5001;
const server=app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})
//AUTH
//HAbit
//USER
//Setting 
//notification
//feed 