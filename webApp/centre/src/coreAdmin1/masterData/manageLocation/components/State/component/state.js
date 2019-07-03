import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const State = new Mongo.Collection('state');

if(Meteor.isServer){
  Meteor.publish('statedata',function statedata(){
      return State.find({});
  });  
  
}
Meteor.methods({
  'addStates' : function(stateValues) { 
    var stateData = State.findOne({"countryName" : stateValues.country, "stateName" : stateValues.state}); 
    if(stateData){
      var result = 'exist';
    }else{    
       var result = State.insert({
          "countryName"   : stateValues.country,           
          "stateName"     : stateValues.state,     
          "updatedAt"       : new Date(), 
          "createdAt"       : new Date(), 
        }); 
    } 
    return result;                                                 
  },

'deleteStates':function(id){
     State.remove({'_id': id});
  
  },

 
  'updateStates' : function(id,stateValues) {      
       State.update(
        { '_id': id },
       {
         $set:{ 
           "countryName"   : stateValues.country,  
           "stateName"      : stateValues.state ,     
           "updatedAt"       : new Date(), 
                    
       } });                                                   
  },

  'CSVUploadstate': function(csvObject){
    var uploadSyncArr = [];
    var count         = 0;
    if(csvObject){
      // console.log("csvObject.length: ",csvObject.length);
      UserSession.set("allProgressbarSession", csvObject.length-2, Meteor.userId());
      for(i=0;i<csvObject.length-1;i++){
          count++;
              uploadSyncArr[i] = State.insert({
                  'countryName'                   : csvObject[i].country,
                  'stateName'                     : csvObject[i].state,
                  
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
