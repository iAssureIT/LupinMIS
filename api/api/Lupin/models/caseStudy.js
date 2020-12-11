
const mongoose = require('mongoose');

const caseStudySchema = mongoose.Schema({
    _id		            : mongoose.Schema.Types.ObjectId,
    date                : String,  //yyyy-mm-dd
    title               : String,
    center_ID           : String,
    center              : String,
    sector_ID           : String,
    sectorName          : String,
    author              : String,
    caseStudy_Image     : [{
                                imgPath : String,
                            }],
    caseStudy_File      : [{
                                fileName : String,
                                filePath : String,
                            }],
    createdAt           : Date
});

module.exports = mongoose.model('caseStudy',caseStudySchema);



