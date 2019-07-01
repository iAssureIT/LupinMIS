import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const MartialStatus = new Mongo.Collection('MartialStatus');

if(Meteor.isServer){
  Meteor.publish('MartialStatusdata',function MartialStatusdata(){
      return MartialStatus.find({});
  }); 
  Meteor.publish('getMartialStatusdata',function MartialStatusdata(id){
      return MartialStatus.findOne({"_id":id});
  });  
  
}
Meteor.methods({
  'insertMartialStatus' : function(martialstatusValues) {   
    // console.log('js countriesValues',countriesValues);
    var MartialStatusData = MartialStatus.findOne({"martialStatus" :martialstatusValues.MartialStatus});
    if(MartialStatusData){
      var result = 'exist';
    }else{  
         var result = MartialStatus.insert({
            "martialStatus"   :martialstatusValues.MartialStatus,
            "updatedAt"       : new Date(), 
            "createdAt"       : new Date(),                           
          });   
    } 
    return result;                                               
  },

  'getAllMartialStatusData':function(country){
    console.log(MartialStatus);
    if(MartialStatus){
      return MartialStatus.find({'countryName':MartialStatus},{sort:{'createdAt':-1}}).fetch({}) || [];
    }else{
      return MartialStatus.find({},{sort:{'createdAt':-1}}).fetch({}) || [];
    }
  },


'deleteMartialStatus':function(id){
     MartialStatus.remove({'_id': id});
  
  },

  
  'updateMartialStatus' : function(id,martialStatus) {      
       MartialStatus.update(
        { '_id': martialStatus.MartialStatusId },
       {
         $set:{             
           "martialStatus"    :martialStatus.MartialStatus ,    
              
       } });                                                   
  },

});