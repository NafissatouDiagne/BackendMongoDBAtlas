const mongoose = require('mongoose')
const data= mongoose.Schema({
    title:{ type: String,required:true},
    description: {type: String, required:true},
    imageUrl: {type: String, required:true},
    price:{ type:String, required:true},
});
module.exports = mongoose.model('thing',data);