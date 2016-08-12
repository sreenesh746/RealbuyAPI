var mongoose = require('../settings/db').mongoose;
var propertySchema = new mongoose.Schema({
    saleType: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: [Number],
        required: true,
        index: '2d'
    },
    price: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number
    },
    bedrooms: {
        type: Number
    },
    availability: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    builtUpArea: {
        type: Number,
        required: true
    },
    carpetArea: {
        type: Number,
        required: true
    },
    propertyFloor: {
        type: Number
    },
    totalFloors: {
        type: Number
    },
    ownership: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    addedOn: {
        type: Date,
        default: Date.now
    },
    transactionType: {
        type: String,
        required: true
    },
    favCount: {
        type: Number,
        default: 0
    }
});

propertySchema.index({
    address: 'text',
    city: 'text'
});
module.exports = mongoose.model('property', propertySchema);