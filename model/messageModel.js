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
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // receiver: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
    date_time: {
      type: Date,
      default: Date.now(),
    },
    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);

module.exports = Message;
