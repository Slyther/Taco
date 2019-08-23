const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }
});

columnSchema.statics.findByBoardId = async function (id) {
    let columns = await this.find({
      board: id,
    });
  
    return columns;
};

columnSchema.pre('remove', function(next) {
    this.model('Card').deleteMany({ column: this._id }, next);
});

module.exports = mongoose.model('Column', columnSchema);
