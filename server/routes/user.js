const {STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_CALLBACK_URL} = require('../constants')
const api_helper = require('../utils/apiHelper')
const axios = require('axios')

var express = require('express');
var router = express.Router();

//Page to be loaded after succesful login
router.get('/', function(req, res, next) {
  res.render('user', { title: 'User' });
});

router.get('/strava-auth/', function(req, res) {
    var user_address = req.query['user_address'];

    var redirect_url = 'https://www.strava.com/oauth/authorize?';
    redirect_url = redirect_url + 'client_id=' + STRAVA_CLIENT_ID;
    redirect_url = redirect_url + '&redirect_uri=' + STRAVA_CALLBACK_URL;
    redirect_url = redirect_url + '&response_type=code';
    redirect_url = redirect_url + '&approval_prompt=force';
    redirect_url = redirect_url + '&scope=activity:read_all';
    redirect_url = redirect_url + '&state=' + user_address;

    res.redirect(redirect_url);
});

router.post('/strava-auth/callback/', function(req, res) {
    
    var code = req.body['code'];
    var scope = req.body['scope'];

    var token_exchange_url = 'https://www.strava.com/oauth/token?';
    token_exchange_url = token_exchange_url + 'client_id=' + STRAVA_CLIENT_ID;
    token_exchange_url = token_exchange_url + '&client_secret=' + STRAVA_CLIENT_SECRET;
    token_exchange_url = token_exchange_url + '&code=' + code;
    token_exchange_url = token_exchange_url + '&grant_type=authorization_code';

    axios.post(token_exchange_url).then(function (response) {

       console.log(response);
    }).catch(function(exception) {

    });
});

//POST after wallet login/signup [Public Key available]
router.post('/register', function(req, res) {

    console.log('Insided response');
    // Set our internal DB variable
    var dbclient = req.dbclient.connect();

    // Get our form values. These rely on the "name" attributes
    var address = req.body.address;

    const impeldb = dbclient.db('impel');
    const usersCollection = database.collection('users');

    // Submit to the DB
    usersCollection.insertOne({
        "address" : address
    }, {"bypassDocumentValidation": true, "forceServerObjectId": true}, function (err, doc) {
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
