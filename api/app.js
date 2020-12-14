	const express 						= require ('express');
	const app 							= express();
	const morgan 						= require('morgan');// morgan call next function if problem occure
	const bodyParser 					= require('body-parser');// this package use to formate json data 
	const mongoose 						= require ('mongoose');
	const globalVariable 				= require("./nodemon.js");
 
	const dbname 						= globalVariable.dbname;
	global.JWT_KEY 						= globalVariable.JWT_KEY;

	mongoose.connect('mongodb://localhost/'+dbname,{
		useNewUrlParser: true,	
	})
	mongoose.promise = global.Promise;

	app.use(morgan("dev"));
	app.use('/uploads', express.static('uploads'));
	app.use(bodyParser.urlencoded({ extended: false }));
	// app.use(bodyParser.json());
	app.use(bodyParser.json({limit: '20mb'}));

	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		if (req.method === "OPTIONS") {
			res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
			return res.status(200).json({});
		}
		next();
	});

	// Routes which should handle requests
	
	const usersRoutes				= require("./api/coreAdmin/routes/users.js");
	const rolesRoutes				= require("./api/coreAdmin/routes/roles");
	const masternotificationRoutes 	= require("./api/coreAdmin/routes/masternotifications");
	// const notificationRoutes 		= require("./api/coreAdmin/routes/notifications");
	const companySettingRoutes		= require("./api/coreAdmin/routes/companysettings");
	const projectSettingRoutes		= require("./api/coreAdmin/routes/projectSettings");
	const file_upload 				= require("./api/coreAdmin/routes/file_upload.js")


	const CentersRoutes				= require("./api/Lupin/routes/centers"); 
	const sectorsRoutes				= require("./api/Lupin/routes/sectors"); 
	const sectorMappingsRoutes		= require("./api/Lupin/routes/sectorMappings"); 
	const projectMappingsRoutes		= require("./api/Lupin/routes/projectMappings"); 
	const familiesRoutes			= require("./api/Lupin/routes/families"); 
	const annualPlanRoutes			= require("./api/Lupin/routes/annualPlans"); 
	const monthlyPlanRoutes			= require("./api/Lupin/routes/monthlyPlans"); 
	const activityReportRoutes		= require("./api/Lupin/routes/activityReport"); 
	const beneficiaryRoutes			= require("./api/Lupin/routes/beneficiaries"); 
	const typeofCentersRoutes		= require("./api/Lupin/routes/typeofcenters");
	const typeofGoalsRoutes		    = require("./api/Lupin/routes/typeofgoals");
	const caseStudyRoutes		    = require("./api/Lupin/routes/caseStudy");
	const highlightRoutes		    = require("./api/Lupin/routes/highlights");
	const unitRoutes		    	= require("./api/Lupin/routes/units.js");

	const reportRoutes 				= require("./api/Lupin/routes/reports.js");
	const reportNewRoutes 			= require("./api/Lupin/routes/reports_new.js");
	const dashboardReportRoutes 	= require("./api/Lupin/routes/reports_dashboard.js");
	const centerRankingRoutes 		= require("./api/Lupin/routes/center_ranking.js");
	const notificationMonthlyRoutes = require("./api/Lupin/routes/notificationMonthly.js");
	

	const countriesRoutes           = require("./api/LocationApi/routes/countries.js");
	const statesRoutes              = require("./api/LocationApi/routes/states.js");
	const districtsRoutes           = require("./api/LocationApi/routes/districts.js");
	const blocksRoutes              = require("./api/LocationApi/routes/blocks.js");
	const citiesRoutes              = require("./api/LocationApi/routes/cities.js");
	

	app.use("/api/countries",countriesRoutes);
	app.use("/api/states",statesRoutes);
	app.use("/api/districts",districtsRoutes);
	app.use("/api/blocks",blocksRoutes);
	app.use("/api/villages",citiesRoutes);

	app.use("/api/users",usersRoutes);
	app.use("/api/roles",rolesRoutes);

	app.use("/api/masternotification",masternotificationRoutes);
	app.use("/api/companysettings",companySettingRoutes);
	app.use("/api/projectsettings",projectSettingRoutes);
	app.use("/api/upload",file_upload);

	app.use("/api/centers",CentersRoutes);
	app.use("/api/sectors",sectorsRoutes);
	app.use("/api/sectorMappings",sectorMappingsRoutes);
	app.use("/api/projectMappings",projectMappingsRoutes);
	app.use("/api/families",familiesRoutes);
	app.use("/api/annualPlans",annualPlanRoutes);
	app.use("/api/monthlyPlans",monthlyPlanRoutes);
	app.use("/api/activityReport",activityReportRoutes);
	app.use("/api/beneficiaries",beneficiaryRoutes);
	app.use("/api/typeofcenters",typeofCentersRoutes);
	app.use("/api/typeofgoals",typeofGoalsRoutes);
	app.use("/api/caseStudies",caseStudyRoutes);
	app.use("/api/highlights",highlightRoutes);
	app.use("/api/units",unitRoutes);
	app.use("/api/centerRanking",centerRankingRoutes);

	app.use("/api/report",reportRoutes);
	app.use("/api/reports",reportNewRoutes);
	app.use("/api/reportDashboard",dashboardReportRoutes);
	app.use("/api/planReminder",notificationMonthlyRoutes);
	app.use((req, res, next) => {
		const error = new Error("Not found");
		error.status = 404;
		next(error);
	});

	app.use((error, req, res, next) => {
		res.status(error.status || 500);
		res.json({
				error: {
				message: error.message
				}
			});
	});

	module.exports = app;