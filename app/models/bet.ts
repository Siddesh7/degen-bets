import {model, models, Schema} from "mongoose";

const betSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  bet: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  priceTarget: {
    type: Number,
    required: true,
  },

  totalBetAmount: {
    type: Number,
  },
  buyers: {
    type: Array,
  },
  sellers: {
    type: Array,
  },
});

const Bet = models.Bet || model("Bet", betSchema);
export default Bet;
