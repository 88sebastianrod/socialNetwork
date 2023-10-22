const { Schema, Types, model } = require('mongoose');

const ReactionSchema = Schema({

    reactionId: {
        type: Schema.Types.ObjectId,
        default: new Types.ObjectId
    },

    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        get: function (value) {
            return value.toString();
        }
    }

});

const ThoughtSchema = Schema({

    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: function (value) {
            return value.toString();
        }
    },
    username: {
        type: String,
        required: true
    },
    reactions: [ReactionSchema]

}, {
    virtuals: {
        reactionCount: {
            get() {
                return this.reactions.length;
            }
        }
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ThoughtSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Thought', ThoughtSchema);