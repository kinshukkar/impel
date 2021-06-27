var express = require('express');
var router = express.Router();

//Page to be loaded after succesful login
router.get('/', function(req, res, next) {
  res.render('user', { title: 'User' });
});

//POST after wallet login/signup [Public Key available]
router.post('/login', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var publicKey = req.body.publickey;

    // Set our collection
    var collection = db.get('user');

    // Submit to the DB
    collection.insert({
        "publicKey" : publicKey
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
			res.render('user', { title: publicKey });
        }
    });

});

module.exports = router;
