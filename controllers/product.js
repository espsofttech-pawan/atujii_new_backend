const CryptoJS = require("crypto-js");

const config = require('../config');
const adminQueries = require("../services/authQueries");
var validator = require("email-validator");
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const { response } = require("express");
const authQueries = require("../services/authQueries");

exports.product = async (db,req,res)=>{
    await db.query(adminQueries.getProduct , function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "error occured",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
        msg : "Footer Details",
        response : data
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No Data"
            });            
        }
    });
}

exports.getAllProductList = async (db,req,res)=>{
    var type = req.body.type
    var orderby = req.body.order_by
    var min = '';
    var max = '';

    qry = `SELECT * FROM item WHERE type = ${type}`;

    if(orderby == '1'){
        qry= qry+' ORDER BY price ASC limit 12';
    }
    if(orderby == '2'){
        qry= qry+' ORDER BY price DESC limit 12';
    }
    if(orderby == '3'){
        qry= qry+' order by datetime DESC limit 12';
    }
    if(orderby == '4'){
        qry= qry+' order by datetime ASC limit 12';        
    }
    if(min > '0' && max > '0'){
        qry= qry+`WHERE Price BETWEEN ${min} AND ${max}`;
    }
    if(!orderby && !min && !max){
        qry= qry+' LIMIT 12';  
    }

    await db.query(qry, function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "error occured",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
        msg : "Footer Details",
        response : data
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No Data"
            });            
        }
    });
}


exports.listItem = async (db,req,res)=>{
  
    var orderby = req.body.orderby;
    var min  = req.body.min;
    var max = req.body.max;
 
    // 1 For Minimum price
    // 2 For Maximum price
    // 3 Newest
    // 4 Oldest

    qry = `SELECT * FROM item`;

    if(orderby == '1'){
        qry= qry+' ORDER BY price ASC limit 12';
    }
    if(orderby == '2'){
        qry= qry+' ORDER BY price DESC limit 12';
    }
    if(orderby == '3'){
        qry= qry+' order by datetime DESC limit 12';
    }
    if(orderby == '4'){
        qry= qry+' order by datetime ASC limit 12';        
    }
    if(min > '0' && max > '0'){
        qry= qry+`WHERE Price BETWEEN ${min} AND ${max}`;
    }
    if(!orderby && !min && !max){
        qry= qry+' Limit 12';  
    }
    
    

     //console.log(qry);
    await db.query(qry, function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "error occured",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
        response : data
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No Data"
            });            
        }
    });
}


exports.getFilterCategory = async (db,req,res)=>{
    await db.query(authQueries.categoryDetail,function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "error occured",
            error
        });
    }
        if(data.length>0){
    res.status(200).send({
        success:true,
        msg : "Category Item Details",
        response:data
     });
        }else{
            res.status(200).send({
                success:false,
                msg:"No Data"
            });            
        }
    });
    }

    exports.insertContact = async (db,req,res)=>{
        var name = req.body.name;
        var email = req.body.email;
        var subject = req.body.subject;
        var comment = req.body.comment;
        var captcha_code = req.body.captcha_code;
        var type = req.body.type;
        
        if (!name) {
            return res.status(200).send({
                success: false,
                msg: "Name required"
            });
        }
    
        if (!email) {
            return res.status(200).send({
                success: false,
                msg: "Email required"
            });
        }
    
        if (!subject) {
            return res.status(200).send({
                success: false,
                msg: "Subject required"
            });
        }
    
        if (!comment) {
            return res.status(200).send({
                success: false,
                msg: "Comment required"
            });
        }  
    
        if (!captcha_code) {
            return res.status(200).send({
                success: false,
                msg: "Captcha required"
            });
        }      
    
        var arr = {
            'name' : name,
            'email' : email,
            'subject' : subject,
            'comments' : comment,
            'type' : type
        }
    
        await db.query(authQueries.insertContacts, arr ,function (error, data) {
            if (error) {
                return res.status(200).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            if (data) {
                res.status(200).send({
                    success: true,
                    msg: "Contact form submitted successfully."
    
                });
            } else {
                res.status(200).send({
                    success: false,
                    msg: "No records found!"
                });
            }
        });
    }
    
            
     exports.getContact= async (db,req,res)=>{
    
        await db.query(authQueries.getContact,function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data.length>0){
        res.status(200).send({
            success:true,
            msg : "Contacts Records",
            response:data
         });
            }else{
                res.status(200).send({
                    success:false,
                    msg:"No data found!!"
                });            
            }
        });
        }
    
    
    