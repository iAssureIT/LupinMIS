import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const Religion = new Mongo.Collection('Religion');

if(Meteor.isServer){
  Meteor.publish('Religiondata',function Religionsdata(){
      return Religion.find({});
  }); 
  Meteor.publish('getReligiondata',function Religiondata(id){
      return Religion.findOne({"_id":id});
  });  
 
}
Meteor.methods({
  'insertReligion' : function(religionValues) {   
    // console.log('js countriesValues',countriesValues);
    var ReligionData = Religion.findOne({"Religion" :religionValues.Religion});
    if(ReligionData){
      var result = 'exist';
    }else{  
         var result = Religion.insert({
            "Religion"   :religionValues.Religion,
            "updatedAt"       : new Date(), 
            "createdAt"       : new Date(),                           
          });   
    } 
    return result;                                               
  },

  'getAllReligionData':function(country){
    console.log(Religion);
    if(Religion){
      return Religion.find({'Religion':Religion},{sort:{'createdAt':-1}}).fetch({}) || [];
    }else{
      return Religion.find({},{sort:{'createdAt':-1}}).fetch({}) || [];
    }
  },


'deleteReligion':function(id){
     Religion.remove({'_id': id});
  
  },

  
  'updateReligion' : function(id,Religion) {      
       Religion.update(
        { '_id': id },
       {
         $set:{             
           "Religion"    :Religion.Religion ,    
            
                      
                    
       } });                                                   
  },

});