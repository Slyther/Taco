const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String
    },
    activity: {
        type: Array
    },
    column: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column'
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }
});

cardSchema.statics.findByBoardId = async function (id) {
    let cards = await this.find({
      board: id,
    });
  
    return cards;
};
  

module.exports = mongoose.model('Card', cardSchema);
