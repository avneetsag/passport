const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://avneetsag:saggu1234@cluster0.oc2nc.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true });
const Device = require('./models/device');
const User = require('./models/user');

//mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const { exists } = require('./models/device');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;
app.use(express.static('public'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
'The APi is working!'
* @apiErrorExample {json} Error-Response:
* null
*/


app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});
app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body; const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added device and data');
    });
});

app.post('/api/authenticate', (req, res) => {
    const { user, password } = req.body;
    console.log(req.body);
    User.findOne({ name: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (!found) {
            return res.send('Sorry. We cant find any such username');
        }
        else if (found.password != password) {
            return res.send('The password is invalid');
        }
        else {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: found.isAdmin
            });
        }
    });
});
app.post('/api/registration', (req, res) => {
    const { user, password, isAdmin } = req.body;
    console.log(req.body);
    User.findOne({ name: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (found) {
            return res.send('User already exists');
        }
        else {
            const newUser = new User({
                name: user,
                password,
                isAdmin
            });
            newUser.save(err => {
                return err
                    ? res.send(err)
                    : res.json({
                        success: true,
                        message: 'Created new user'
                    });
            });
        }
    });
});


/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
[
  {
      "ts": "1529542743",
      "temp": 14,
      "loc": {
          "lat": 33.812092,
          "lon": -117.918974
      }
  }
]
* @apiErrorExample {json} Error-Response:
* null
*/


/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
[
  {
      "ts": "1529545935",
      "temp": 14,
      "loc": {
          "lat": -37.839587,
          "lon": 145.101386
      }
  }
]
* @apiErrorExample {json} Error-Response:
* null
*/
/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
[
  {
      "ts": "1529545935",
      "temp": 14,
      "loc": {
          "lat": -37.839587,
          "lon": 145.101386
      }
  }
]
* @apiErrorExample {json} Error-Response:
* null
*/

app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({ "_id": deviceId }, (err, devices) => {
        const { sensorData } = devices;
        return err
            ? res.send(err)
            : res.send(sensorData);
    });
});
/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
[
{
"sensorData": [
    {
        "ts": "1529542230",
        "temp": 12,
        "loc": {
            "lat": -37.84674,
            "lon": 145.115113
        }
    },
    {
        "ts": "1529572230",
        "temp": 17,
        "loc": {
            "lat": -37.850026,
            "lon": 145.117683
        }
    }
],
"_id": "5f1afa6e3b6c1b71af88d7c6",
"id": "0",
"name": "Alex's iPhone",
"user": "alex"
}
]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response: 
[
{
  "sensorData": [
      {
          "ts": "1529545935",
          "temp": 14,
          "loc": {
              "lat": -37.839587,
              "lon": 145.101386
          }
      }
  ],
  "_id": "5f1afa6e3b6c1b71af88d7c7",
  "name": "Bob's Samsung Galaxy",
  "user": "bob",
  "id": "2"
}
]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
[
{
  "sensorData": [],
  "_id": "5f1cf8b48609e079442a7e7f",
  "name": "Kev's Samsung",
  "user": "kev",
  "__v": 0
}
]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/
app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
        return err
            ? res.send(err)
            : res.send(devices);
    });
});

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:

* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* }
* ]
* }
* ]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:

* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* }
* ]
* }
* ]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:

* [
* {
"_id": "5f1afa6e3b6c1b71af88d7c6",
        "id": "0",
        "name": "Alex's iPhone",
        "user": "alex"
    },
    {
        "sensorData": [
            {
                "ts": "1529545935",
                "temp": 14,
                "loc": {
                    "lat": -37.839587,
                    "lon": 145.101386
                }
            }
        ]
        * @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/


/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:

* [
* {
 "_id": "5f1afa6e3b6c1b71af88d7c7",
        "name": "Bob's Samsung Galaxy",
        "user": "bob",
        "id": "2"
    },
    {
        "sensorData": [],
        "_id": "5f1cf8478609e079442a7e7e",
        "__v": 0
  
        * @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
[]
  
        * @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/
app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
        return err
            ? res.send(err)
            : res.send(devices);
    });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
