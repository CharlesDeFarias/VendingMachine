module.exports = function(app, passport, db) {

// normal routes ===============================================================
    // show the home page
    app.get('/', function(req, res) {
      db.collection('items').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {
          items: result
        })
      })
    })

    // OWNER SECTION =========================
    app.get('/owner', isLoggedIn, function(req, res) {
      db.collection('items').find().toArray((err, items) => {
        if (err) return console.log(err)
        db.collection('bank').find().toArray((err, bank) => {
          if (err) return console.log(err)
          res.render('owner.ejs', {items: items, bank: bank})
        })
      })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// Items posting & putting===============================================================
    app.post('/items', (req, res) => {
      db.collection('items').save({name: req.body.name, pic: req.body.pic, code: req.body.code, stock: req.body.stock, price:req.body.price}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/owner')
      })
    })

    app.put('/items', (req, res) => {
      db.collection('items').findOneAndUpdate({name: req.body.name, code: req.body.code}, {
        $set: {
          //have to make sure to add newStock to request in javascript that does put fetch request
          stock:parseInt(req.body.stock, 10) + parseInt(req.body.newStock, 10)
        }
      }, {
        sort: {_id: -1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    // app.delete('/items', (req, res) => {
    //   db.collection('items').findOneAndDelete({name: req.body.name, code: req.body.code}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })
//Choosing specific item from items collection based on Code
// app.get('/item', (req, res) => {
//   db.collection('items').findOne({code: req.body.code}, (err, result) => {
//     if (err) return console.log(err)
//     res.render('index.ejs', {
//     item: result
//     })
//   })
//   console.log(req.body.code)
// })

// Bank updating
app.put('/bank', (req, res) => {
  db.collection('bank').findOneAndUpdate({name: bank}, {
    //Make sure to give the bank document a name field
    $set: {
      //have to make sure to add the price of the selected item to the put fetch for updating bank
      bank:req.body.bank + req.body.price
    }
  }, {
    sort: {_id: -1},
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });
        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/owner', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        // SIGNUP =================================
        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/owner', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future
    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
