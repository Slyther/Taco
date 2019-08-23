const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    }
});

boardSchema.pre('remove', function(next) {
    this.model('Column').deleteMany({ board: this._id }).exec();
    this.model('Card').deleteMany({ board: this._id }).exec();

    next();
});

module.exports = mongoose.model('Board', boardSchema);
