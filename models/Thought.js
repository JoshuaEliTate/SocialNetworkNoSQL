const { Schema, model } = require('mongoose');

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (date) => {
          if (date) return date.toISOString().split("T") [0];
        },
    },
    // username: {
    //   type: String,
    //   required: true,
    // },
    username: { type: Schema.Types.ObjectId, ref: 'User' }
    // reactions: {
    //   type: [ReactionSchema],
    //   required: false
    // }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },

  }

  );
  ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
  });

const ReactionSchema = new Schema(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
      reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
      },
      username: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (date) => {
          if (date) return date.toISOString().split("T") [0];
        },
      },
    },
    {
      toJSON: {
        getters: true,
      },

    }
  );

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;