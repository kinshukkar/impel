const {STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_CALLBACK_URL} = require('../constants')
const api_helper = require('../utils/apiHelper')
const axios = require('axios')
const { MongoClient } = require("mongodb");

var express = require('express');
var router = express.Router();

const databaseName = "impel";

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
    const { provider_address, challengeId, startTime, endTime } = req.query;

    var payload = {
        provider_address,
        challengeId,
        startTime,
        endTime
    };
    var state = JSON.stringify(payload);

    var redirect_url = 'https://www.strava.com/oauth/authorize?';
    redirect_url = redirect_url + 'client_id=' + STRAVA_CLIENT_ID;
    redirect_url = redirect_url + '&redirect_uri=' + STRAVA_CALLBACK_URL;
    redirect_url = redirect_url + '&response_type=code';
    redirect_url = redirect_url + '&approval_prompt=force';
    redirect_url = redirect_url + '&state=' + state;
    redirect_url = redirect_url + '&scope=activity:read_all';

    res.redirect(redirect_url);
});

// const sampleStravaRes = [ {
//     "resource_state" : 2,
//     "athlete" : {
//       "id" : 134815,
//       "resource_state" : 1
//     },
//     "name" : "Happy Friday",
//     "distance" : 24931.4,
//     "moving_time" : 4500,
//     "elapsed_time" : 4500,
//     "total_elevation_gain" : 0,
//     "type" : "Ride",
//     "workout_type" : null,
//     "id" : 154504250376823,
//     "external_id" : "garmin_push_12345678987654321",
//     "upload_id" : 987654321234567891234,
//     "start_date" : "2018-05-02T12:15:09Z",
//     "start_date_local" : "2018-05-02T05:15:09Z",
//     "timezone" : "(GMT-08:00) America/Los_Angeles",
//     "utc_offset" : -25200,
//     "start_latlng" : null,
//     "end_latlng" : null,
//     "location_city" : null,
//     "location_state" : null,
//     "location_country" : "United States",
//     "achievement_count" : 0,
//     "kudos_count" : 3,
//     "comment_count" : 1,
//     "athlete_count" : 1,
//     "photo_count" : 0,
//     "map" : {
//       "id" : "a12345678987654321",
//       "summary_polyline" : null,
//       "resource_state" : 2
//     },
//     "trainer" : true,
//     "commute" : false,
//     "manual" : false,
//     "private" : false,
//     "flagged" : false,
//     "gear_id" : "b12345678987654321",
//     "from_accepted_tag" : false,
//     "average_speed" : 5.54,
//     "max_speed" : 11,
//     "average_cadence" : 67.1,
//     "average_watts" : 175.3,
//     "weighted_average_watts" : 210,
//     "kilojoules" : 788.7,
//     "device_watts" : true,
//     "has_heartrate" : true,
//     "average_heartrate" : 140.3,
//     "max_heartrate" : 178,
//     "max_watts" : 406,
//     "pr_count" : 0,
//     "total_photo_count" : 1,
//     "has_kudoed" : false,
//     "suffer_score" : 82
//   }, {
//     "resource_state" : 2,
//     "athlete" : {
//       "id" : 167560,
//       "resource_state" : 1
//     },
//     "name" : "Bondcliff",
//     "distance" : 23676.5,
//     "moving_time" : 5400,
//     "elapsed_time" : 5400,
//     "total_elevation_gain" : 0,
//     "type" : "Ride",
//     "workout_type" : null,
//     "id" : 1234567809,
//     "external_id" : "garmin_push_12345678987654321",
//     "upload_id" : 1234567819,
//     "start_date" : "2018-04-30T12:35:51Z",
//     "start_date_local" : "2018-04-30T05:35:51Z",
//     "timezone" : "(GMT-08:00) America/Los_Angeles",
//     "utc_offset" : -25200,
//     "start_latlng" : null,
//     "end_latlng" : null,
//     "location_city" : null,
//     "location_state" : null,
//     "location_country" : "United States",
//     "achievement_count" : 0,
//     "kudos_count" : 4,
//     "comment_count" : 0,
//     "athlete_count" : 1,
//     "photo_count" : 0,
//     "map" : {
//       "id" : "a12345689",
//       "summary_polyline" : null,
//       "resource_state" : 2
//     },
//     "trainer" : true,
//     "commute" : false,
//     "manual" : false,
//     "private" : false,
//     "flagged" : false,
//     "gear_id" : "b12345678912343",
//     "from_accepted_tag" : false,
//     "average_speed" : 4.385,
//     "max_speed" : 8.8,
//     "average_cadence" : 69.8,
//     "average_watts" : 200,
//     "weighted_average_watts" : 214,
//     "kilojoules" : 1080,
//     "device_watts" : true,
//     "has_heartrate" : true,
//     "average_heartrate" : 152.4,
//     "max_heartrate" : 183,
//     "max_watts" : 403,
//     "pr_count" : 0,
//     "total_photo_count" : 1,
//     "has_kudoed" : false,
//     "suffer_score" : 162
//   } ];
function getAthleteData (stravaAthleteUrl, provider_address, challengeId) {
    axios.get(stravaAthleteUrl).then((res) => {
        console.log('stravaAthleteUrl', res);
        const athleteActivitiesData = res.data;
        if (athleteActivitiesData.length > 0) {
            const distancesCoveredByAllAthletes = athleteActivitiesData.map(athleteActivityData => Math.ceil(athleteActivityData.distance))
            const payload = {
                provider_address,
                distances_covered: distancesCoveredByAllAthletes,
                challengeId
            };
            dbHelper().then((client) => {
                var db = client.db(databaseName);
                const challengesCollection = db.collection('challenges');
        
                challengesCollection.insert(payload, {"bypassDocumentValidation": true, "forceServerObjectId": true}, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        res.send("There was a problem adding the information to the database.");
                    }
                    else {
                        // And forward to success page
                        console.log("entry created");
                    }
                });
            });
        }
        // And forward to success page
        console.log("No data available");
    }).catch(err => {
        console.log(err)
    });
}

router.get('/strava-auth/callback', function(req, res) {
    
    const { code, scope, state } = req.query;

    const { provider_address, challengeId, startTime, endTime } = JSON.parse(state);

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

    axios.post(token_exchange_url).then(function (request) {
        // res.status(200).json(response);
        const access_token = request.data.access_token;
        const athlete = request.data.athlete;
        var activities = `https://www.strava.com/api/v3/athlete/activities?before=${endTime}&after=${startTime}&page=1&per_page=100&access_token=${access_token}`;
        getAthleteData(activities, provider_address, challengeId);
        return res.redirect('http://impelapp.com')
    }).catch(function(err) {
        console.log(err)
    });
});

//POST after wallet login/signup [Public Key available]
router.post('/register', function(req, res) {

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
