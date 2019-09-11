import { Schema, model } from 'mongoose';

const boardSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    owner: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    users: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    archived: {
        type: Boolean,
        default: false
    }
});

boardSchema.pre('remove', function(next) {
    this.model('Column').deleteMany({ board: this._id }).exec();
    this.model('Card').deleteMany({ board: this._id }).exec();

    next();
});

export default model('Board', boardSchema);
