
const mongoose = require('mongoose');

const highlightSchema = mongoose.Schema({
    _id		            : mongoose.Schema.Types.ObjectId,
    date                : String,  //yyyy-mm
    title               : String,
    center              : String,
    center_ID           : String,
    userName            : String,
    highlight_Image     : [{
                                imgPath : String,
                            }],
    highlight_File      : [{
                                fileName : String,
                                filePath : String,
                            }],
    createdAt           : Date
});
module.exports = mongoose.model('highlight',highlightSchema);



