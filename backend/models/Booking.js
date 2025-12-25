const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lawyer',
        required: true
    },
    lawyerName: String,

    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },

    date: String,
    time: String,
    slotId: String,

    amount: {
        type: Number,
        default: 0
    },
    charged: {
        type: Boolean,
        default: false
    },
    chargedAt: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
