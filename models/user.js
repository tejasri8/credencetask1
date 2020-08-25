var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

var passportLocalMongoose = require('passport-local-mongoose'); 
  //writing user schema
  //here we are specifiying the type 
  //required:true specify that should be entered compulsory
  
  
var UserSchema = new Schema({    
    email: {type: String, required:true ,unique:true}, 
    username : {type: String,  required:true,unique:true},
   
   
    
}); 
  
// plugin for passport-local-mongoose 
UserSchema.plugin(passportLocalMongoose); 

  
// export userschema 
//here user is a collection
 var User = mongoose.model("User", UserSchema); 
 module.exports =User;