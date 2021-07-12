const {STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_CALLBACK_URL} = require('../constants')
const api_helper = require('../utils/apiHelper')
const axios = require('axios')
const { MongoClient } = require("mongodb");

var express = require('express');
var router = express.Router();

function dbHelper() {
    const url = "mongodb://139.59.77.81:27017/?poolSize=20&writeConcern=majority";
    return new MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}

//Page to be loaded after succesful login
router.get('/', function(req, res, next) {
  res.render('user', { title: 'User' });
});

router.get('/strava-auth/', function(req, res) {
    //var user_address = req.query['user_address'];
    // provider_address = "KK";
    // challenge_id = 1
    // startTime = 12312424 / 1000
    // endTime  / 1000

    var state = "";
    var redirect_url = 'https://www.strava.com/oauth/authorize?';
    redirect_url = redirect_url + 'client_id=' + STRAVA_CLIENT_ID;
    redirect_url = redirect_url + '&redirect_uri=' + STRAVA_CALLBACK_URL;
    redirect_url = redirect_url + '&response_type=code';
    redirect_url = redirect_url + '&approval_prompt=force';
    redirect_url = redirect_url + '&scope=activity:read_all';
    redirect_url = redirect_url + '&state=' + state;

    res.redirect(redirect_url);
});

router.get('/strava-auth/callback', function(req, res) {
    
    var code = req.query['code'];
    var scope = req.query['scope'];
    var state = req.query['state'];

    var token_exchange_url = 'https://www.strava.com/oauth/token?';
    token_exchange_url = token_exchange_url + 'client_id=' + STRAVA_CLIENT_ID;
    token_exchange_url = token_exchange_url + '&client_secret=' + STRAVA_CLIENT_SECRET;
    token_exchange_url = token_exchange_url + '&code=' + code;
    token_exchange_url = token_exchange_url + '&grant_type=authorization_code';

  // data: {
  //   token_type: 'Bearer',
  //   expires_at: 1626115415,
  //   expires_in: 21600,
  //   refresh_token: '1759e7a74938b5beb4e201f77d8eff32a5a1df41',
  //   access_token: '3cc6b788f4bcc9f2f83917d8e9b01e80d2be78ef',
  //   athlete: {
  //     id: 36069869,
  //     username: 'kinshuk_kar',
  //     resource_state: 2,
  //     firstname: 'Kinshuk',
  //     lastname: 'Kar',
  //     bio: null,
  //     city: null,
  //     state: null,
  //     country: null,
  //     sex: 'M',
  //     premium: false,
  //     summit: false,
  //     created_at: '2018-10-28T12:11:24Z',
  //     updated_at: '2021-06-11T13:43:24Z',
  //     badge_type_id: 0,
  //     weight: null,
  //     profile_medium: 'https://lh3.googleusercontent.com/a-/AOh14GhKDt2qqN3TrEkChNFAi7i_jYsG5p-ecAS2N4pIQA=s96-c',
  //     profile: 'https://lh3.googleusercontent.com/a-/AOh14GhKDt2qqN3TrEkChNFAi7i_jYsG5p-ecAS2N4pIQA=s96-c',
  //     friend: null,
  //     follower: null
  //   }

    axios.post(token_exchange_url).then(function (response) {
       res.status(200).json({"success": "true"});
       var activities = "https://www.strava.com/api/v3/athlete/activities?before=&after=&page=1&per_page=100";

    }).catch(function(exception) {
        res.status(200).json({"error": "exception"});

    });
});

//POST after wallet login/signup [Public Key available]
router.post('/register', function(req, res) {
    const databaseName = "impel";

    var address = req.body.address;
    console.log(req.body.address);

    dbHelper().then((client) => {
        var db = client.db(databaseName);
        const usersCollection = db.collection('users');

        usersCollection.insertOne({
            "address" : address
        }, {"bypassDocumentValidation": true, "forceServerObjectId": true}, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                console.log("entry created");
                res.status(200).json({"success": "true"});
            }
        });
    });

});

module.exports = router;
