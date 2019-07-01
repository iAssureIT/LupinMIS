import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const Religion = new Mongo.Collection('Religion');

if(Meteor.isServer){
  Meteor.publish('Religiondata',function Religiondata(){
      return Religion.find({});
  }); 
  Meteor.publish('getReligiondata',function Religiondata(id){
      return Religion.findOne({"_id":id});
  });  
  
}
Meteor.methods({
  'insertReligion' : function(religionValues) {   
    // console.log('js countriesValues',countriesValues);
    var Religiondata = Religion.findOne({"religion" :religionValues.Religion});
    if(Religiondata){
      var result = 'exist';
    }else{  
         var result = Religion.insert({
            "religion"   :religionValues.Religion,
            "updatedAt"       : new Date(), 
            "createdAt"       : new Date(),                           
          });   
    } 
    return result;                                               
  },

  'getAllReligiondata':function(country){
    console.log(Religion);
    if(Religion){
      return Religion.find({'religion':Religion},{sort:{'createdAt':-1}}).fetch({}) || [];
    }else{
      return Religion.find({},{sort:{'createdAt':-1}}).fetch({}) || [];
    }
  },


'deleteReligion':function(id){
     Religion.remove({'_id': id});
  
  },

  
  'updateReligion' : function(id,religion) {      
       Religion.update(
        { '_id': id },
       {
         $set:{             
           "religion"    :religion.Religion ,    
            
                      
                    
       } });                                                   
  },

});