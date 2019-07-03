import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const Countries = new Mongo.Collection('countries');

if(Meteor.isServer){
  Meteor.publish('countriesdata',function countriesdata(){
      return Countries.find({});
  }); 
  Meteor.publish('getcountriesdata',function getcountriesdata(id){
      return Countries.findOne({"_id":id});
  });  
  
}
Meteor.methods({
  'insertCountries' : function(countriesValues) {   
    // console.log('js countriesValues',countriesValues);
    var countryData = Countries.findOne({"countryName" :countriesValues.country});
    if(countryData){
      var result = 'exist';
    }else{  
         var result = Countries.insert({
            "countryName"     :countriesValues.country, 
            "nationality"     :countriesValues.Nationality,
            "updatedAt"       : new Date(), 
            "createdAt"       : new Date(),                           
          });   
    } 
    return result;                                               
  },

  'getAllCountryData':function(country){
    console.log(country);
    if(country){
      return Countries.find({'countryName':country},{sort:{'createdAt':-1}}).fetch({}) || [];
    }else{
      return Countries.find({},{sort:{'createdAt':-1}}).fetch({}) || [];
    }
  },


'deleteCountries':function(id){
     Countries.remove({'_id': id});
  
  },

  
  'updateCountries' : function(id,countryName) {      
       Countries.update(
        { '_id': id },
       {
         $set:{             
           "countryName"    :countryName.country ,    
           "nationality"     :countryName.Nationality, 
                      
                    
       } });                                                   
  },

  'CSVUploadCountries': function(csvObject){
    var uploadSyncArr = [];
    var count         = 0;
    if(csvObject){
      // console.log("csvObject.length: ",csvObject.length);
      UserSession.set("allProgressbarSession", csvObject.length-2, Meteor.userId());
      for(i=0;i<csvObject.length-1;i++){
          count++;
          var countriesdata = Countries.findOne({"countryName":csvObject[i].country});
          if(countriesdata){
            Countries.update(
            { '_id': countriesdata._id },
           {
             $set:{             
               "countryName"    :csvObject[i].country,
               'updatedAt'      : new Date(),                     
           } }); 
          }else{ 
              uploadSyncArr[i] = Countries.insert({
                    'countryName'                    : csvObject[i].country,
                    'updatedAt'                     : new Date(), 
                    'createdAt'                     : new Date(), 
              });
              if(uploadSyncArr[i]){
                UserSession.set("progressbarSession", i, Meteor.userId());
              }
          }
      }// EOF i
    }

    return count;
  },
});