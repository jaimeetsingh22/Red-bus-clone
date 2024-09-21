const express=require('express')
const bodyparser=require('body-parser')
const cors =require('cors')
const mongoose=require('mongoose')

const app=express();

app.use(cors({
    origin: 'https://exquisite-paletas-52ab7a.netlify.app/',
    optionsSuccessStatus: 200
  }));
app.use(bodyparser.json())
const customerroutes=require("./routes/customer");
const routesroute=require("./routes/route");
const bookingroute=require("./routes/booking")
app.use(bookingroute)
app.use(routesroute)
app.use(customerroutes)

const DBURL = "mongodb+srv://jaimeet:jaimeet321@cluster0.rdb37qe.mongodb.net/tedbus?retryWrites=true&w=majority&appName=Cluster0";
console.log(DBURL);
// const DBURL="mongodb://127.0.0.1:27017/tedbus" // local db
mongoose.connect(DBURL)
.then(()=> console.log("Mongodb connected"))
.catch(err=> console.error('Mongodb connection error:' ,err))

app.get('/',(req,res)=>{
    res.send('Hello , Ted bus is working')
})
 
const PORT= 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
