 const mongoose = require('mongoose');

 const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
},
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    contact: Number,
    picture: String,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model('user', userSchema);