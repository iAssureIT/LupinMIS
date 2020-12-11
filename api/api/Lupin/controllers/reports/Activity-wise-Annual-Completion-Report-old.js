const mongoose	= require("mongoose");

const ActivityReport = require('../models/activityReport');
const AnnualPlan = require('../models/annualPlans');


exports.activityWiseAnnualReport = (req,res,next)=>{
    ActivityReport.aggregate(
        {$match : {
                    "sector": req.params.sector,
                    "year"  : req.params.year,
                    "centre": req.params.centre,
                  },
         $group : {
                    by : "activity",
                  }
        )
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

/* ==============
Expected output

{
    sector: xx,
    center: xx,
    year: xx,
    totalCount : 1000,
    dataRecords : [
        {
            activity: xxx,
            subActivity: xxx,
            unit: xxx,
            annualPlanReach: xx,
            annualPlanFamilyUpgrade: xx,
            annualPlanPhyUnits:  xx,
            annualPlanTotalBudget : xx,
            actualReach: xx,
            actualFamilyUpgrad: xx,
            actualPhyUnits: xx,
            actualTotalExp: xx
            actualFundsLHWRF: xxx,
            actualFundsNabard: xxx,
            actualFundsBankLoan: xx,
            actualFundsDirectComm: xx,
            actualFundsIndirectComm: xx,
            actualFundsGovt: xx,
            actualFundsOthers: xx,
            Remarks: xx
        }
    ],
    sumRecord : [
        {
            annualPlanReach: xx,
            annualPlanFamilyUpgrade: xx,
            annualPlanPhyUnits:  xx,
            annualPlanTotalBudget : xx,
            actualReach: xx,
            actualFamilyUpgrad: xx,
            actualPhyUnits: xx,
            actualTotalExp: xx
            actualFundsLHWRF: xxx,
            actualFundsNabard: xxx,
            actualFundsBankLoan: xx,
            actualFundsDirectComm: xx,
            actualFundsIndirectComm: xx,
            actualFundsGovt: xx,
            actualFundsOthers: xx,
        }
    ],


}


================ */