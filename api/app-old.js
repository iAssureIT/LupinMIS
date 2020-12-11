const express = require ('express');
const app = express();
const morgan = require('morgan');// morgan call next function if problem occure
const bodyParser = require('body-parser');// this package use to formate json data 
const mongoose = require ('mongoose');

const usersRoutes				= require("./api/coreAdmin/routes/users.js");
const rolesRoutes				= require("./api/coreAdmin/routes/roles");
// const masternotificationRoutes 	= require("./api/coreAdmin/routes/masternotification");
const notificationRoutes 				= require("./api/coreAdmin/routes/notification");
const companySettingRoutes			= require("./api/coreAdmin/routes/companysettings");


const CentersRoutes							= require("./api/Lupin/routes/centers"); 
const sectorsRoutes							= require("./api/Lupin/routes/sectors"); 
const sectorMappingsRoutes			= require("./api/Lupin/routes/sectorMappings"); 
const familiesRoutes						= require("./api/Lupin/routes/families"); 
const annualPlanRoutes					= require("./api/Lupin/routes/annualPlans"); 
const monthlyPlanRoutes					= require("./api/Lupin/routes/monthlyPlans"); 
const activityReportRoutes			= require("./api/Lupin/routes/activityReport"); 
const beneficiaryRoutes					= require("./api/Lupin/routes/beneficiaries"); 








// mongoose.connect('mongodb://localhost/iassureitreactcms',{
// 	useNewUrlParser: true
// })

mongoose.connect(
	'mongodb+srv://iassureit:iAssureIT123@cluster0-2axn3.mongodb.net/test?retryWrites=true'
);

mongoose.promise =global.Promise;

// process.env.MANGO_ATLAS_PW envirnmaent variable name
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));// urlencode true and false simple-body url data
app.use(bodyParser.json());// it show json data in good manner

app.use((req, res, next) =>{
	res.header("Access-Control-Allow-origin","*"); // use API from anywhere insted of * we use domain
	res.header("Access-Control-Allow-Headers","Origin, X-requested-With, Content-Type, Accept, Authorization");

	if (req.method === 'OPTIONS') {
		req.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.use("/api/users",usersRoutes);
app.use("/api/roles",rolesRoutes);
// app.use("/api/masternotifications",masternotificationRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/companysettings",companySettingRoutes);
// app.use("/api/pagedesignmasters",pagedesignmastersRoutes);

// app.use("/api/blockdesignmasters",blockdesignmastersRoutes);
// app.use("/api/cmsblocks",cmsblockRoutes);


app.use("/api/centers",CentersRoutes);
app.use("/api/sectors",sectorsRoutes);
app.use("/api/sectorMappings",sectorMappingsRoutes);
app.use("/api/families",familiesRoutes);
app.use("/api/annualPlans",annualPlanRoutes);
app.use("/api/monthlyPlans",monthlyPlanRoutes);
app.use("/api/activityReport",activityReportRoutes);
app.use("/api/beneficiaries",beneficiaryRoutes);









// handle all other request which not found 
app.use((req, res, next) => {
	const error = new Error('Not Found Manual ERROR');
	error.status = 404;
	next(error);
		// when we get 404 error it send to next 
});

// it will handel all error in the application
app.use((error, req, res, next) => {
	// 500 type error is used when we use database
	res.status(error.status || 500);
	res.json({
		error:{
			message:error.message
		}
	})
});

module.exports = app;

