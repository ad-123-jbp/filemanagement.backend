const express = require('express');
const router = express.Router();



const userRouter= require('../routes/user.routes')

const filemodel= require('../models/file.model')

const authMiddleware= require('../middlewares/auth')

const multer= require('multer'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    
    return cb(null, `${Date.now()}-${file.originalname}`);
  }
})
const upload = multer({ storage: storage });

router.get('/home',authMiddleware, async (req,res)=>{

  const userfiles= await filemodel.find({
    user: req.user.userId
  })

  console.log(userfiles);

  res.render('home',{
    files: userfiles
  });

    
  
})

router.post('/upload',authMiddleware,  upload.single('file'), async function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    const newfile= await filemodel.create({
      path: req.file.path,
      originalname: req.file.originalname,
      user: req.user.userId

    })
    res.json(newfile)



    console.log(req.body);
    console.log(req.file);

    return res.redirect('/');

  })


























module.exports = router;
