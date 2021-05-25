const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var config = require('../config');
var db = require('../utils/connection');


router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);     


var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      console.log(file.originalname);
      var filetype = '';
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      if(file.mimetype === 'image/jpg') {
        filetype = 'jpg';
      }
      if(file.mimetype === 'video/mp4') {
        filetype = 'mp4';profile
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});
var pageUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])


// ---------------Controllers--------
const signup = require('../controllers/signup');
const login = require('../controllers/login');
const admin = require('../controllers/admin/admin');
const getFile = require('../controllers/getFile');
const product = require('../controllers/product');
const getNftDetails = require('../controllers/nft');
const nft = require('../controllers/nft');

//==============Post Status API ===================================
router.post('/adminlogin', admin.login.bind(this, db));
router.get('/getfooter', admin.getFooter.bind(this, db));
router.get('/getusers', admin.getUserDetail.bind(this, db));
router.get('/getwebcontent', admin.getWebContent.bind(this, db));
router.get('/getmarketplace', admin.getMarketPlace.bind(this, db));


router.post('/insertmarketplace',admin.insertMarketPlace.bind(this,db));
router.post('/getorder', admin.getOrderDetail.bind(this, db));
router.post('/updatefooter', admin.updateFooter.bind(this, db));
router.post('/updatewebcontent', admin.updateWebContent.bind(this, db));
router.post('/getsingleuser', admin.getSingleUserDetail.bind(this, db));

/*--------- Item Category ---------*/
router.post('/insertcategory', admin.insertCategory.bind(this, db));
router.get('/getcategory', admin.getCategory.bind(this, db));
router.post('/singlecategory', admin.singleCategory.bind(this, db));
router.post('/updatecategory', admin.updateCategory.bind(this, db));
router.post('/deletecategory', admin.deleteCategory.bind(this, db));

/*--------- End Category ---------*/

/*--------- Item  ---------*/
router.post('/insertitem',pageUpload,admin.insertItem.bind(this, db));
router.post('/deleteitem', admin.deleteItem.bind(this, db));
router.post('/updateitem',pageUpload,admin.updateItem.bind(this, db));
router.get('/getitem', admin.getItem.bind(this, db));
router.post('/getNftDetails' , getNftDetails.getNftDetails.bind(this, db));
router.post('/itemBuy' , nft.itemBuy.bind(this, db));
router.post('/charge', nft.charge.bind(this, db));
router.post('/getTransactions' , nft.getTransactions.bind(this, db));
router.post('/getUserOrder', nft.getUserOrder.bind(this, db));
router.post('/getOrderDetails', nft.getOrderDetails.bind(this, db));

router.post('/saveContactForm', product.insertContact.bind(this,db));
router.get('/getContact',product.getContact.bind(this,db));
/*--------- End Item ---------*/

router.get("/uploads/:image", getFile.getImage);

router.post('/updateprofilepic', signup.insertProfilePic.bind(this, db));
router.post('/getprofilepic', signup.getProfilePic.bind(this, db));

router.get('/dashboarditem',admin.dashboardItem.bind(this, db));
router.get('/getUserTelent',admin.getTelentUsers.bind(this, db));
router.get('/getuser',admin.getUsers.bind(this, db));
router.post('/deleteuser',admin.deleteUser.bind(this, db));
router.post('/updateprofilepicAdmin', admin.insertProfilePic.bind(this, db));
router.post('/adminpassword',admin.changePassword.bind(this, db));
router.post('/adminprofilepic', admin.getProfilePic.bind(this, db));

router.post('/register', signup.register.bind(this, db));
router.post('/verifyAccount/:token', signup.activateAccount.bind(this, db));
router.post('/login', login.login.bind(this, db));
router.post('/forgot', signup.forgot.bind(this, db));
router.post('/resetpassword', signup.Resetpassword.bind(this, db));
router.post('/getuserprofile', signup.getUserProfile.bind(this, db));
router.post('/updateuserprofile', signup.userProfile.bind(this, db));
router.post('/deactivate', signup.deActivateAccount.bind(this, db));
router.post('/changepassword', signup.changePassword.bind(this, db));
router.get('/getcountries', signup.getCountry.bind(this, db));
router.get('/getProductList', product.product.bind(this, db));
router.post('/getAllProductList', product.getAllProductList.bind(this, db));
router.post('/listItem', product.listItem.bind(this, db));
router.get('/getFilterCategory', product.getFilterCategory.bind(this, db));



router.post('/addWishList', nft.addWishList.bind(this, db));
router.post('/getWishlist', nft.getWishlist.bind(this, db));
router.post('/removeNftItem', nft.removeNftItem.bind(this, db));
router.post('/getWishlistNft', nft.getWishlistNft.bind(this, db));

router.get("/", function (request, response) {
    response.contentType("routerlication/json");
    response.end(JSON.stringify("Node is running"));    
});

router.get("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}", 
    });
});

router.post("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

function ensureWebToken(req, res, next) {

    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWT(req, res, next);
    } else {
        res.sendStatus(403);
    }
}

async function verifyJWT(req, res, next) {

    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            next();
        }
    })
}




module.exports.routes = router;
