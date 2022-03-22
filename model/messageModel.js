const { Schema, model } = require("mongoose");
const messageSchema = new Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    attachment: [
      {
        type: String,
      },
    ],
    sender: {
      id: Schema.Types.ObjectId,
      name: String,
      avatar: String,
    },
    receiver: {
      id: Schema.Types.ObjectId,
      name: String,
      avatar: String,
    },
    date_time: {
      type: Date,
      default: Date.now,
    },
    chat_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
