  const express = require("express");
  const app = express();
  const path = require("path");
  // const nocache = require("nocache");
  // const bodyparser=require("body-parser")
  const session = require("express-session");
  const nocache = require("nocache");
  const morgan = require("morgan");
  const { name } = "ejs";


  
  require('dotenv').config()

  // const router = require("./routes/user")
  const port = process.env.port || 5001;
    




  

  const userRouter = require("./routes/user");
  const adminRouter = require("./routes/admin");
  // const collection=require("./model/mongodb")
 
  app.use("/static", express.static(path.join(__dirname, "public")));
  app.use(express.static("public"));
  app.set('views',path.join(__dirname,'views'))
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.set("view engine", "ejs");

  const oneday = 1000 * 60 * 60 * 24; //one day in seconds

  // app.use(
  //   session({
  //     secret: "your-Secret-Key",
  //     resave: false,
  //     cookie: { maxAge: oneday },
  //     saveUninitialized: true,
  //   })
  // );
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));
  app.use(nocache());

  app.use("/", userRouter);
  app.use("/admin", adminRouter);

  app.listen(port, (error) => {
    console.log(`server running on http://localhost:${port}`);
    
  });
