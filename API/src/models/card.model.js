import { Schema, model } from 'mongoose';

const cardSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String
    },
    activity: [{
        type: String
    }],
    column: {
        type: Schema.Types.ObjectId,
        ref: 'Column'
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

cardSchema.statics.findByBoardId = async function (id) {
    let cards = await this.find({
      board: id,
    });
  
    return cards;
};

export default model('Card', cardSchema);
