  
require("dotenv").config();
const cors = require('cors')
const express = require("express");
const app = express();
const routes = require("./routes");
const { checkUser} = require("./auth/token_validation");

app.use(express.json());

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions))
app.get('*',checkUser);
app.use(routes);

app.use(function(err,req,res,next){
  console.log(err);
  res.status(404).json({
    succes:0,
    message:"Something Went Wrong!!"
  });
})

const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});