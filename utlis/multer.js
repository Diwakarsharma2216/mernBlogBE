
const multer=require("multer")
const fs=require("fs")
const storage = multer.diskStorage({
  
    destination: function (req, file, cb) {

        let uploadPath = 'uploads/';
        if (file.fieldname === 'userImage') {
            uploadPath += 'user-images/';
          } else if (file.fieldname === 'blogImage') {
            uploadPath += 'blog-posts/';
          }

           // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix +"-"+ file.originalname  )
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports=upload