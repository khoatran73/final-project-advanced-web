const User = require('../models/User')
class HomeController {
    home(req, res) {
        const email= req.session.passport.user.email || req.session.email;
        const user= User.findOne({email:email});
        if(user){
            User.findOne({email:email})
            .then(data=>{
                res.render('index',{user:data});
            })
        }else{
            res.render('index',{user:{}})
        }
    }
}

module.exports = new HomeController;
