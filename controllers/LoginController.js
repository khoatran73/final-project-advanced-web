
class LoginController {
    get(req, res) {
        res.render('login')
    }
}

module.exports = new LoginController;
