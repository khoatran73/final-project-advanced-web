const User = require('../models/User')
class HomeController {
    home(req, res) {
        const id= req.session.passport.user._id;
        const user= User.findById({_id:id});
        if(user){
            User.findById({_id:id})
            .then(data=>{
                res.render('index',{user:data});
            })
        }else{
            res.render('index',{user:{}})
        }
    }
}

module.exports = new HomeController;
