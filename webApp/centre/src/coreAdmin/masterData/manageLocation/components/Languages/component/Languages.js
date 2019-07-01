import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const Languages = new Mongo.Collection('Languages');

if(Meteor.isServer){
  Meteor.publish('Languagesdata',function Languagesdata(){
      return Languages.find({});
  }); 
  Meteor.publish('getLanguagesdata',function Languagesdata(id){
      return Languages.findOne({"_id":id});
  });  
  
}
Meteor.methods({
  'insertLanguages' : function(languagesValues) {   
    // console.log('js countriesValues',countriesValues);
    var LanguagesData = Languages.findOne({"languages" :languagesValues.Languages});
    if(LanguagesData){
      var result = 'exist';
    }else{  
         var result = Languages.insert({
            "languages"   :languagesValues.Languages,
            "updatedAt"       : new Date(), 
            "createdAt"       : new Date(),                           
          });   
    } 
    return result;                                               
  },

  'getAllLanguagesdata':function(country){
    console.log(Languages);
    if(Languages){
      return Languages.find({'languages':Languages},{sort:{'createdAt':-1}}).fetch({}) || [];
    }else{
      return Languages.find({},{sort:{'createdAt':-1}}).fetch({}) || [];
    }
  },


'deleteLanguages':function(id){
     Languages.remove({'_id': id});
  
  },

  
  'updateLanguages' : function(id,languages) {      
       Languages.update(
        { '_id': id },
       {
         $set:{             
           "languages"    :languages.Languages ,    
            
                      
                    
       } });                                                   
  },

});