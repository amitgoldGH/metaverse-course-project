/* eslint-disable no-unused-vars */
const router = require('express').Router();

let gameLot = require('../models/gamelot.model');

let user = require('../models/user.model');

router.route('/').get((req, res) => {
  gameLot
    .find()
    .sort({ lot_id: 'asc' })
    .then((gameLots) => {
      console.log('GET REQUEST FOR ALL LOTS');
      res.json(gameLots);
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/:lot_id').get((req, res) => {
  gameLot
    .findOne({ lot_id: req.params.lot_id })
    .then((gameLots) => {
      console.log('GET REQUEST FOR LOT ID: ', gameLots.lot_id);
      res.json(gameLots);
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const owner_id = req.body.owner_id.toLowerCase();
  const lot_id = req.body.lot_id;
  const lot_row = req.body.lot_row;
  const lot_col = req.body.lot_col;
  const type = req.body.type;

  const price = req.body.price;
  const for_sale = req.body.for_sale;
  const has_game = req.body.has_game;

  const newGameLot = new gameLot({
    owner_id,
    lot_id,
    lot_row,
    lot_col,
    type,
    price,
    for_sale,
    has_game
  });

  newGameLot
    .save()
    .then(() => {
      console.log(req.body);
      res.json('Game lot added!');
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/buy/:lot_id').post((req, res) => {
  gameLot
    .findOne({ lot_id: req.params.lot_id })
    .then((foundLot) => {
      if (foundLot.for_sale == true) {
        user
          .findOne({ username: req.body.authorized_user.toLowerCase() })
          .then((foundBuyer) => {
            if (foundBuyer.usertype == 'dealer' && foundLot.price <= foundBuyer.balance) {
              user
                .findOne({ username: foundLot.owner_id })
                .then((foundOwner) => {
                  foundBuyer.balance -= foundLot.price;
                  foundOwner.balance += foundLot.price;
                  foundLot.owner_id = foundBuyer.username;

                  foundOwner.save();
                  foundBuyer.save();
                  foundLot.save();

                  return res
                    .status(200)
                    .json(
                      'User ' +
                        foundBuyer.username +
                        ' purchased lot id: ' +
                        foundLot.lot_id +
                        ' from ' +
                        foundOwner.username
                    );
                })
                .catch((err) => {
                  res.status(404).json("Couldn't find owner of lot " + err);
                });
            } else {
              res.status(400).json('Insufficient funds or wrong user type');
            }
          })
          .catch((err) => {
            res.status(404).json("Couldn't find user of buyer " + err);
          });
      } else {
        res.status(400).json('This lot is not for sale');
      }
    })
    .catch((err) => {
      res.status(404).json("Couldn't find lot " + err);
    });
});

router.route('/update').put((req, res) => {
  if (req.body.authorized_user != null)
    gameLot
      .findOne({ lot_id: req.body.lot_id })
      .then((found) => {
        console.log(
          'RECEIVED PUT REQUEST FROM: ',
          req.body.authorized_user,
          ' FOR LOT_ID: ',
          req.body.lot_id,
          ', CURRENT OWNER OF LOT_ID: ',
          req.body.lot_id,
          ' IS: ',
          found.owner_id
        );
        console.log(req.body);

        if (req.body.authorized_user == found.owner_id) {
          user
            .findOne({ username: req.body.owner_id })
            .then((foundUser) => {
              if (foundUser.usertype == 'dealer') {
                let updated = found;
                updated.owner_id = req.body.owner_id;
                updated.price = req.body.price;
                updated.for_sale = req.body.for_sale;
                updated.has_game = req.body.has_game;
                updated
                  .save()
                  .then(() => {
                    console.log('Updated lot id: ', updated.lot_id);
                    res.status(200).json('Updated lot id: ' + updated.lot_id);
                  })
                  .catch((err) => res.status(400).json('Error: ' + err));
              }
            })
            .catch((err) => res.status(404).json("ERROR: New owner wasn't found in database"));
        }
      })
      .catch((err) => res.status(404).json("ERROR: Couldn't find lot in database."));
});

module.exports = router;
