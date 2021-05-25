
const authQueries = require('../services/authQueries');
var fetch = require('node-fetch');
const stripe = require("stripe")('sk_test_51IpRmeSD2c5qKNYTLUUaGtaPpALirAVmekLD0KHt5xNg3iWHEW0zBvdgtC4zv8YhQcH52Cw6wTfqf5akAwZo2Bn3002xvBslji');

exports.getNftDetails = async (
    db, req, res) => {   
        var id  = req.body.id;    
    try {
        db.query(authQueries.getNftDetails, id , async function (error, nftlist) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (nftlist.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : nftlist[0]
                });
            }
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: "unexpected internal error",
            err
        });
    }
}

exports.addWishList = async (
    db, req, res) => {
        var product_id  = req.body.id;
        var user_id  = req.body.user_id;    
    try {
        db.query(authQueries.getWishList, [user_id, product_id] , async function (error, nftlist) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (nftlist.length > 0) {
                return res.status(200).send({
                    success: false,
                    message: "This NFT already added to wishlist"
                });
            } else {
                var nftData = {
                    "user_id"    : user_id,
                    "product_id" : product_id
                }
                db.query(authQueries.addWishlist,[nftData],function(error,result){
                    if(error){
                        return res.status(400).send({
                            success: false,
                            message: "error occured",
                            error
                        });
                    }
                    if(result){
                        return res.status(200).send({
                            success: true,
                            message: "NFT added to wishlist."
                        });
                    }else{
                        res.status(200).send({
                            success:true,
                            message : "Insertion Failed",
                        });
                    }               
                })                
            }
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: "unexpected internal error",
            err
        });
    }
}


exports.getWishlist = async (
    db, req, res) => {   
        var id  = req.body.id;    
    try {
        db.query(authQueries.getWishlist, id , async function (error, wishlist) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (wishlist.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : wishlist
                });
            }
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: "unexpected internal error",
            err
        });
    }
}

exports.removeNftItem = async (
    db, req, res) => {   
        var id  = req.body.id;    
    try {
        db.query(authQueries.deleteWishlistitem, id , async function (error, wishlist) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "unexpected error occured",
                    error
                });
            }else {
                return res.status(200).send({
                    success: true,
                    msg: "NFT removed to wishlist",
                });
            }
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            msg: "unexpected internal error",
            err
        });
    }
}

exports.getWishlistNft = async (
    db, req, res) => {   
        var id  = req.body.id;    
    try {
        db.query(authQueries.getWishlistNftQry, id , async function (error, wishlist) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (wishlist.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : wishlist[0]
                });
            }
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: "unexpected internal error",
            err
        });
    }
}

    exports.itemBuy = async (db, req, res) => {

        var user_id = req.body.user_id;
        var buyerAddress = req.body.buyerAddress;
        var trx_amount = req.body.trx_amount;
        var item_id = req.body.item_id;
        var trx_currency = req.body.trx_currency;
        var owner = (!req.body.user_name)?'User':req.body.user_name;
        var amounTrxHash = req.body.trx_hash;
        var token_id = req.body.tokenId;
        var price = req.body.price;
        var trx_type = req.body.trx_type;
        var stripe_res = req.body.stripe_res;
    
    
        var ip = null;
        var datetime = new Date();
    
    
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "user_id required "
            });
        }
        if (!buyerAddress) {
            return res.status(400).send({
                success: false,
                msg: "buyerAddress required "
            });
        }
        if (!owner) {
            return res.status(400).send({
                success: false,
                msg: "owner required "
            });
        }
        if (!token_id) {
            return res.status(400).send({
                success: false,
                msg: "token_id required "
            });
        }
        if (!price) {
            return res.status(400).send({
                success: false,
                msg: "Price required "
            });
        }
        await db.query("SELECT * FROM admin_wallet limit 1", async function (adminError, adminWallet) {
            if (adminError) {
                return res.status(400).send({
                    success: false,
                    msg: adminError
                });
            }
    
            var from_address = adminWallet[0].admin_address;
            var from_private_key = adminWallet[0].admin_private_key;
            var to_address = buyerAddress;
     
            var arr = {
                "from_address": from_address,
                "from_private_key": from_private_key,
                "contract_address": "0x02b93Da71d6aE4CD0189682dD007A1da2479D93E",
                "to_address": to_address,
                "tokenId": token_id
            }
            const response1 = await fetch('http://52.66.202.69:7002/api/nft/transfer', {
                method: 'POST', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arr)
            });
            const data1 = await response1.json();
            
            console.log(data1);
            if (!data1.hash) {
                return res.status(200).send({
                    success: false,
                    msg: data1.msg,
                });
            }
            const transfer_hash = data1.hash;
         
            var dataUpdate = {
                "is_sold": 1,
                "owner": owner,
                "owner_id":user_id
            }
        
            await db.query(authQueries.buyItem, [dataUpdate,item_id],async function (error, dataResult) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured",
                        error
                    });
                }
                
                var orderData = {
                    "user_id":user_id,
                    "item_id":item_id,
                    "price":price,
                    "status":1,
                    "amounTrxHash":amounTrxHash,
                    "transfer_hash":transfer_hash,
                    "currency":trx_currency,
                    "trx_amount":trx_amount,
                    "trx_type" : trx_type,
                    "stripe_res" : stripe_res
                }
                console.log(orderData);
                await db.query(authQueries.orderForBuyItem, [orderData], async function (error1, orderResult) {
                    if (error1) {
                        return res.status(400).send({
                            success: false,
                            msg: "error occured",
                            error1
                        });
                    } else{
                        res.status(200).send({
                            success: true,
                            orderId : orderResult.insertId,
                            msg: "Item purchased Successfully "
                        });                        
                    }             
            });
        });
    });
    }

exports.getTransactions = async (
    db, req, res) => {   
        var user_id  = req.body.user_id;    
    try {
        db.query(authQueries.getTransactionsQry, user_id , async function (error, transactions) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    message: "unexpected error occured",
                    error
                });
            } else if (transactions.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No data found"
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "data get successfully",
                    response : transactions
                });
            }
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: "unexpected internal error",
            err
        });
    }
}


    /* ---------------------------  STRIPE PAYMENT GATEWAY IMPLEMENTATION ---------------*/
    exports.charge= async (db,req,res)=>{
        var amount =req.body.amount
        var id=req.body.id
        try {
      var customer = await stripe.customers.create({
        name: 'Jenny Rosen',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        }
      });
          const payment = await stripe.paymentIntents.create({
            customer:customer.id,
            amount: amount,
            currency: "USD",
            description: "Your Company Description",
            payment_method: id,
            confirm: true,
          });
          console.log("stripe-routes.js 19 | payment", payment);
          res.json({
            message: "Payment Successful",
            success: true,
            res : payment.id
          });
        } catch (error) {
          console.log("stripe-routes.js 17 | error", error);
          res.json({
            message: "Payment Failed",
            success: false,
            error : error,
          });
        }
      };

      exports.getUserOrder = async (db, req, res) => {
        var user_id = req.body.id;
        if (!user_id) {
            return res.status(400).send({
                success: false,
                msg: "User ID required"
            });
        }
        await db.query(authQueries.getAllOrder, [user_id], function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            if (data) {
                res.status(200).send({
                    success: true,
                    data:data,
    
                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "No records found!"
                });
            }
        });
    }

    exports.getOrderDetails = async (db, req, res) => {
    
        var id = req.body.id;
    
        if (!id) {
            return res.status(400).send({
                success: false,
                msg: "transaction ID required"
            });
        }
    
        await db.query(authQueries.getOrderDetails, [id], function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            if (data) {
                res.status(200).send({
                    success: true,
                    data:data[0],
    
                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "No records found!"
                });
            }
        });
    }