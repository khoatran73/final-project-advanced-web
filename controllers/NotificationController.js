
class NotificationController {
    
    index(req, res) {
        res.send('notification page')
        // res.render('new') render views
    }
}

module.exports = new NotificationController;
