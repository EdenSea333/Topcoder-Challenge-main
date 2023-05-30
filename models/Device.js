const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  model: {
    type: String,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  lastCheckedOutBy: {
    type: Schema.Types.ObjectId
  },
  lastCheckedOutDate: {
    type: Date,
  },
  lastCheckedInDate:{
      type:Date,
  },
  registeredBy:{
    type: Schema.Types.ObjectId,
    required: true
  },
  registeredDate:{
      type: Date,
      default: Date.now()
  },
  isCheckedOut:{
    type: Boolean,
    default: false
  },
  feedbacks: [
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      rating:{
          type: Schema.Types.Number,
          default: 5
      },
      text: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('device', DeviceSchema);
