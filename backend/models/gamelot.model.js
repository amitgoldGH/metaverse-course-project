const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// eslint-disable-next-line no-unused-vars
const gamelotSchema = new Schema({
  owner_id: { type: String, default: 'System', required: true },
  lot_id: { type: Number, unique: true, required: true },
  lot_row: { type: Number, required: true },
  lot_col: { type: Number, required: true },
  type: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  for_sale: { type: Boolean, required: true },
  has_game: { type: Boolean, required: true }
});

const GameLotModel = mongoose.model('Gamelot', gamelotSchema);

module.exports = GameLotModel;
