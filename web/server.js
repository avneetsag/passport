const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://avneetsag:saggu1234@cluster0.oc2nc.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true });

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const app = express();
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;
const cookie = require('cookie-session');

const User = mongoose.model('User', new mongoose.Schema({
    googleID: String,
    name: String,
    isAdmin: Boolean
}));
mongoose.connect('mongodb+srv://avneetsag:saggu1234@cluster0.oc2nc.mongodb.net', {useNewUrlParser:true, useUnifiedTopology:true})


app.use(express.static('public'));
app.use((req, res, next) => {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
 next();
});


passport.use(new GoogleStrategy(
    {
        clientID: "1088732725830-vhm0q3oh96g1b84umumnapcmgo45kc41.apps.googleusercontent.com",
        clientSecret: "ko4DbCoRAR6mW8fb8f8Uc84_",
        callbackURL: "/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleID: profile.id}).then((currentUser)=> {
            if(currentUser){
                done(null,currentUser);
            }else{
                new User({
                    googleID: profile.id,
                    name: profile.name.givenName,
                    isAdmin: false
                }).save().then((newUser)=>{
                    done(null,newUser);
                });
            }
        })
    }
));
app.use(cookie({
    maxAge: 24*60*60*1000,
    keys:['asfdadssafd']
}));



app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
});

app.get('/', function (req, res) {
    res.sendFile(`${base}/device-list.html`);
   });
   app.get('/register-device', (req, res) => {
    res.sendFile(`${base}/register-device.html`);
   });
   app.get('/registration', (req, res) => {
    res.sendFile(`${base}/registration.html`);
   });
   app.get('/send-command', (req, res) => {
    res.sendFile(`${base}/send-command.html`);
   });
   app.get('/login', (req, res) => {
    res.sendFile(`${base}/login.html`);
   });
   app.get('/about', (req, res) => {
    res.sendFile(`${base}/about-me.html`);
   });
   app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get('/auth/google/redirect', passport.authenticate('google'),(req,res)=>{
    const user = req.user;
    app.locals.user = user;
    res.redirect('/');
});
app.get('/auth/google/user', (req,res)=>{
    res.send(app.locals.user)
});
   app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
   });
   app.listen(port, () => {
    console.log(`listening on port ${port}`);
   });
