import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const Location = new Mongo.Collection('location');

if(Meteor.isServer){
  Meteor.publish('locationdata',function locationdata(){
      return Location.find({});
  });  
  
}
Meteor.methods({
  'addLocation' : function(locationValues) {   
  var locationVar = Location.findOne({'countryName' : locationValues.country, 'stateName' : locationValues.state, 'districtName' : locationValues.district,'cityloctn' :locationValues.cityloctn,'pincodeloctn' :locationValues.pincodeloctn});     
    if(locationVar){
      var result = 'exist';
    }else{    
      var result = Location.insert({

        countryName      :locationValues.country,     
        stateName        :locationValues.state,     
        districtName     :locationValues.district, 
        blockloctn       :locationValues.blockloctn,
        cityloctn        :locationValues.cityloctn,
        arealoctn        :locationValues.arealoctn,
        pincodeloctn     :locationValues.pincodeloctn,
        updatedAt        : new Date(), 
        createdAt        : new Date(), 
                  
      }); 
    } 
    return result;                                                 
  },

  'delLocation':function(id){
     Location.remove({'_id': id});
  
  },

  'updateLocation' : function(id,locationValues) {      
       Location.update(
        { '_id': id },
       {
         $set:{   
          countryName      : locationValues.country,     
          stateName        : locationValues.state,     
          districtName     : locationValues.district, 
          blockloctn       : locationValues.blockloctn,
          cityloctn        : locationValues.cityloctn,
          pincodeloctn     : locationValues.pincodeloctn,
          updatedAt        : new Date(), 
                    
       } });                                                    
  },

 'CSVUploadlocation': function(csvObject){
    // check( csvObject, Array);
    var uploadSyncArr = [];
    var count         = 0;
    if(csvObject){
      // console.log("csvObject.length: ",csvObject.length);
      UserSession.set("allProgressbarSession", csvObject.length-2, Meteor.userId());
      for(i=0;i<csvObject.length-1;i++){
          count++;
        uploadSyncArr[i] = Location.insert({
                'countryName'                   : csvObject[i].country,
                'stateName'                     : csvObject[i].state,
                'districtName'                  : csvObject[i].district,
                'blockloctn'                    : csvObject[i].block,
                'cityloctn'                     : csvObject[i].city,
                'arealoctn'                     : csvObject[i].area,
                'pincodeloctn'                  : csvObject[i].pincode,
                'updatedAt'                     : new Date(), 
                'createdAt'                     : new Date(), 
              });
              if(uploadSyncArr[i]){
                UserSession.set("progressbarSession", i, Meteor.userId());
              }
      }// EOF i
    }

    return count;
  },
});
