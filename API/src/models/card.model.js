import { Schema, model } from 'mongoose';
import StringEntityReplacementService from '../services/StringEntityReplacementService';

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
    handler: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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

cardSchema.statics.resolveActivity = async function(activity, models) {
    return Promise.all(
        activity.map(async (x) => StringEntityReplacementService.replace(x, models))
    ).then((act) => {
        return act;
    });
}

export default model('Card', cardSchema);
