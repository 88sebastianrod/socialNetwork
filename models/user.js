const { Schema, model } = require('mongoose');

const UserSchema = Schema({

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    thoughts: {
        type: [Schema.Types.ObjectId],
        ref: 'Thought'
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },

}, {
    virtuals: {
        friendCount: {
            get() {
                return this.friends.length;
            }
        }
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

UserSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('User', UserSchema);