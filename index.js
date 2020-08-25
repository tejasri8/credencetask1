var express = require('express')
var bodyParser = require('body-parser')
var passport = require('passport')
var nodemailer = require('nodemailer');
var router = require('express').Router()
const request = require('request');
var LocalStrategy = require('passport-local').Strategy;
var ejs = require('ejs');
var User = require('./models/user');

//var Details = require('./models/detailsSchema')
const port = process.env.PORT || 4000;
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        //giving the mail details through which the mail should be sent after signed up
        user: 'internship080800@gmail.com',
        pass: 'Internship@123'
    }
});
var app = express()

app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;



//&useNewUrlParser=true&useUnifiedTopology=false
//connecting ourdatabase
mongoose.connect('mongodb+srv://fudict:fudict@client@cluster0.axvuy.mongodb.net/fudict?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }).then(() => { console.log("successful db connection") }).catch((err) => { console.log(err) });
mongoose.set('useFindAndModify', false);
app.set("view engine", 'ejs');
app.use(require('express-session')({
    //hashing the password
    secret: "salt",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//Rendering the login.ejs , to view when we run the server .
app.get('/', (req, res) => {
    res.render('login', { data: { view: false } })
});


//render to the register page
app.get("/signup?", (req, res) => {
    res.render("register", { data: { view: false } });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        data: {
            view: false
        }
    });

});



app.get('/pdetails', function (req, res, next) {

    //here it is
    var user = req.user;
    console.log(user)

    //you probably also want to pass this to your view
    res.render('pdetails', { data: { view: false, title: 'profile', show: user } });
});


//render to the details page once we click on login
app.get('/login', isLoggedIn, function (req, res) {
    res.render('details', { data: { view: false } })
});
app.get('/postsignup', isLoggedIn, function (req, res) {
    res.render('postsignup', { data: { view: false } })
});
app.get("/login", (req, res) => {
    res.render("login", { data: { view: false } });
});
app.get("/details", (req, res) => {
    res.render("details", { data: { view: false } });
});
app.get("/email", (req, res) => {
    res.render("email", { data: { view: false } });
});
app.get("/save", (req, res) => {
    res.render("details", { data: { view: false } });
});









//posting  details in register page 
app.post("/signup", function (req, res) {
    //user is a colllection 
    Users = new User({ email: req.body.email, username: req.body.username, phonenumber: req.body.phonenumber, meteridnumber: req.body.meteridnumber, adhaarnumber: req.body.adhaarnumber });
    //checking whether the given details are exist or new one
    User.register(Users, req.body.cpassword, function (err, user) {
        if (err) {
            res.render('register', { data: { view: true, msg: "given details are already exist" } })//if error msg will print
        } else {
            res.render('login', { data: { view: false } });//if correct render to login page
            //sending email after successfully signedup
            const mailOptions = {
                from: 'internship080800@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: 'Subject of your email', // Subject line
                html: `<h3>Welcome you have sucessfully signed up</h3>
            <h3> ${req.body.username}</h3>
           
            `// plain text body
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err)
                else
                    console.log(info);
            });



        }
    });


});
//posting in login page
app.post("/login", function (req, res) {
    //if user is not given msg will print
    if (!req.body.username) {
        res.render('login', { data: { view: true, msg1: "Username was not given" } })
    } else {
        //if password is not given msg will print
        if (!req.body.password) {
            res.render('login', { data: { view: true, msg: "Password was not given" } })
        } else {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    console.log(err)

                    res.render('login', { data: { view: true, msg: err } })
                } else {
                    if (!user) {
                        //if given details are wrong
                        res.render('login', { data: { view: true, msg: "Username or password incorrect " } })//if given details are wrong
                    } else {
                        req.login(user, function (err) {
                            if (err) {
                                console.log(err)
                                res.render('login', { data: { view: true, msg: err } })

                            } else {
                                //if the ogin details are correct render to details page&and show helps us to print username

                                res.render('details', { data: { view: true, show: req.body.username } });




                            }
                        })
                    }
                }
            })(req, res);
        }
    }
}
)





app.get("/data", (req, res) => {
    User.find({}, (err, result) => {
        if (err)
            console.log(err)
        else {
            res.render("data", { data: { view: false, userdata: result } })

        }
    })

});









function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }

}
//logout 
app.get("/logout", function (req, res) {
    req.logout();
    res.render('login', { data: { view: false } });
});

app.listen(port, () => { console.log(" server running") })