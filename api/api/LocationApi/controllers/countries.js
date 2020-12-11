const mongoose	= require("mongoose");
const async = require("async");
const Countries = require('../models/countries');
const _         = require("underscore");
const parseSchema = require('mongodb-schema');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'locations';

exports.getAllCountries = (req,res,next)=>{

    Countries.find().sort({ "countryName": 1 })
            .exec()
            .then(data=>{
                if(data.length>0){
                    res.status(200).json(data);
                }else{
                    res.status(200).json({"message" : 'Countries not found.'});
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({ 
                    error: err
                });
            });
}
exports.insertCountry = (req,res,next)=>{
    const country = new Countries({
        _id                     : new mongoose.Types.ObjectId(),                    
        countryCode             : req.body.countryCode,
        countryName             : req.body.countryName,
        createdAt               : new Date()
        });
        
        country
        .save()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({ 
                error: err
            });
        });
};

exports.delete_country = (req,res,next)=>{
    // console.log('req.params.countryID', req.params.countryID);
    Countries.deleteOne({_id:req.params.countryID})
        .exec()
        .then(data=>{
            res.status(200).json({
                "message"    : "Country Deleted Successfully.", 
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};