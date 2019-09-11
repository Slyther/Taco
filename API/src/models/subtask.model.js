import { Schema, model } from 'mongoose';

const subtaskSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    card: {
        type: Schema.Types.ObjectId,
        ref: 'Card'
    },
    done: {
        type: Boolean,
        default: false
    }
});  

export default model('Subtask', subtaskSchema);
