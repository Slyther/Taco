import { Schema, model } from 'mongoose';

const columnSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board'
    },
    archived: {
        type: Boolean,
        default: false
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

export default model('Column', columnSchema);
