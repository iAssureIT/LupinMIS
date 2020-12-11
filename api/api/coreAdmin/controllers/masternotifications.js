const mongoose = require("mongoose");
const Masternotifications = require("../models/masternotifications");
var nodeMailer          = require('nodemailer');
const globalVariable    = require("../../../nodemon.js");

exports.create_template = (req, res, next) => {
    var masternotificationData = req.body.templateName;
    var masternotificationtemptype = req.body.templateType
    console.log('masternotificationData ',req.body.templateName);
	Masternotifications.findOne({templateName:masternotificationData, templateType:masternotificationtemptype})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Master Notification Template Name already exists'
				});
			}else{
            const masterNotifications = new Masternotifications({
                _id             : mongoose.Types.ObjectId(),      
                templateType    : req.body.templateType,
                templateName    : req.body.templateName,
                subject         : req.body.subject,
                content         : req.body.content,
            });
            
            masterNotifications.save(
                function(err){
                    if(err){
                        console.log(err);
                        return  res.status(500).json({
                            error: err
                        });          
                    }
                    res.status(200).json({ 
                        message: 'New Notification Template created!',
                        data: masterNotifications
                    });
                }
            );
        }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
// Handle delete contact
exports.delete_template = function (req, res) {
    Masternotifications.deleteOne({
        _id: req.params.notificationmasterID
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'Master notification deleted'
        });
    });
};
exports.detail_fetch = (req,res,next)=>{
    Masternotifications.findOne({_id:req.params.notificationmasterID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Master Notification not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.get_list = (req,res,next)=>{
    Masternotifications.find()
       
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_notifications = (req,res,next)=>{
    // var roleData = req.body.role;
    Masternotifications.updateOne(
            { _id:req.params.notificationmasterID},  
            {
                $set:{
                    "templateType"    : req.body.templateType,
                    "templateName"    : req.body.templateName,
                    "subject"         : req.body.subject,
                    "content"         : req.body.content,
				
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				console.log('data =========>>>',data);
                res.status(200).json("Master notifications Updated");
            }else{
                res.status(401).json("Master notifications Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
// Handle update contact info

// exports.update = function (req, res) {
//     Masternotifications.findById(req.params.notificationID, function (err, masternotifications) {
//             if (err){
//                 res.send(err);
   
//             masternotifications.templateType = req.body.templateType;
//             masternotifications.templateName = req.body.templateName;
//             masternotifications.subject      = req.body.subject;
//             masternotifications.content      = req.body.content;
            
//     // save the contact and check for errors
//     masternotifications.save(function (err) {
//                 if (err)
//                     res.json(err);
//                 res.json({
//                     message: 'master notifications Info updated',
//                     data: masternotifications
//                 });
//             });
//         }
//         });
//     };

exports.send_notifications = (req, res, next) => {
    // console.log("Inside api req====>>>",req.body);
    const senderEmail = 'lupinfoundation1234@gmail.com';
    const senderEmailPwd = 'lupin1234';
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: senderEmail,
            pass: senderEmailPwd
        }
    });
    
    Masternotifications.findOne({'templateName':req.body.templateName})
    .exec()
    .then(data=>{
        main();
        async function main() {
            // console.log("transporter===>",transporter);
            var content    = await getMessageContent(data.content,req.body.variables);        
            var mailOptions = {
                from: '"Lupin" <lupinfoundation1234@gmail.com>', // sender address
                to: req.body.to, // list of receiver
                subject: data.subject, // Subject line
                html: content, // html body
            };
            console.log("mailOptions----->",mailOptions);
            transporter.sendMail(mailOptions, (error, info) => {
                console.log("Test");
                if (error) {
                    res.header("Access-Control-Allow-Origin", "*");
                    console.log("transporter ",error)
                    res.status(200).json({
                        message: "Send Email Failed",
                    });
                }
                if (info) {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.status(200).json({
                        message: "Mail Sent Successfully",
                    });
                }
                res.render('index');
            });
        }
    })
    .catch(err=>{
        console.log('send mail status error ',err);
        res.status(500).json({
            error:err
        });
    });
    
}
function getMessageContent(data,varObj){
    // console.log('data in promise',data)
    if(data){
        var content = data;
        var words = content.match(/\[(.*?)\]/g);
        if(words&&words.length>0){
            // console.log('words',words)
            for (var i = 0; i < words.length; i++) {
                content = content.replace(words[i], varObj[words[i]]);
            }
        }
    }
    // console.log('content in promise',content)
    return content
}