const express = require('express');
const app =express();
const multer= require('multer'); 
const authMiddleware= require('./middlewares/auth')
const filemodel= require('./models/file.model')

const indexRouter= require('./routes/index.routes')

app.use(express.json())


/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    
    return cb(null, `${Date.now()}-${file.originalname}`);
  }
})

const upload = multer({ storage: storage });*/



app.use(express.urlencoded({extended:true}))

const userRouter= require('./routes/user.routes')




/*app.post('/upload', upload.single('file'), async function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    /*const newfile= await filemodel.create({
      path: req.file.path,
      originalname: req.file.originalname,
      user: req.user.userId

    })
    res.json(newfile)



    console.log(req.body);
    console.log(req.file);

    return res.redirect('/');

  })*/
  



const dotenv=require('dotenv');
dotenv.config();

const userModel= require('./models/user.model')


const connectToDB= require('./config/db')
connectToDB();

const cookieparser= require('cookie-parser');










app.set('view engine', 'ejs');

app.use(cookieparser())





app.use('/' ,indexRouter);
app.use('/user' ,userRouter);
    



app.listen(5000, () =>{
    console.log('server is running on port 3000');
})