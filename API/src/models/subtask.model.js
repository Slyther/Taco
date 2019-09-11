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

subtaskSchema.statics.findByCardId = async function (id) {
    let subtasks = await this.find({
      card: id,
    });
  
    return subtasks;
};

export default model('Subtask', subtaskSchema);
