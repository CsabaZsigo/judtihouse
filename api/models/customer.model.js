import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    streetType: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: String,
      required: true,
    },
    door: {
      type: String,
      required: false,
    },
    cityType: {
      type: String,
      required: true,
    },
    hrsz: {
      type: String,
      required: false,
    },
    rooms: {
      type: Number,
      required: true,
    },
    halfRooms: {
      type: Number,
      required: false,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    levels: {
      type: Number,
      required: true,
    },
    heating: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    ownerCity: {
      type: String,
      required: true,
    },
    baseType: {
      type: String,
      required: true,
    },
    buildingArea: {
      type: Number,
      required: true,
    },
    plotArea: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    offset: {
      type: Boolean,
      required: true,
    },
    immediateMove: {
      type: Boolean,
      required: true,
    },
customHeating: {
      type: Boolean,
      required: true,
    },
lowUpkeep: {
      type: Boolean,
      required: true,
    },
goodLayout: {
      type: Boolean,
      required: true,
    },
goodTransportation: {
      type: Boolean,
      required: true,
    },
nearMetro: {
      type: Boolean,
      required: true,
    },
panorama: {
      type: Boolean,
      required: true,
    },
nearWater: {
      type: Boolean,
      required: true,
    },
onBeach: {
      type: Boolean,
      required: true,
    },
balcony: {
      type: Boolean,
      required: true,
    },
gallery: {
      type: Boolean,
      required: true,
    },
galleryAble: {
      type: Boolean,
      required: true,
    },
elevator: {
      type: Boolean,
      required: true,
    },
onGarden: {
      type: Boolean,
      required: true,
    },
onStreet: {
      type: Boolean,
      required: true,
    },
doubleGarage: {
      type: Boolean,
      required: true,
    },
garage: {
      type: Boolean,
      required: true,
    },
driveway: {
      type: Boolean,
      required: true,
    },
americanKitchen: {
      type: Boolean,
      required: true,
    },
fireplace: {
      type: Boolean,
      required: true,
    },
aircondicioned: {
      type: Boolean,
      required: true,
    },
gardenPark: {
      type: Boolean,
      required: true,
    },
quiet: {
      type: Boolean,
      required: true,
    },
light: {
      type: Boolean,
      required: true,
    },
alarm: {
      type: Boolean,
      required: true,
    },
sendOutAddress: {
      type: Boolean,
      required: true,
    },
    sellCause: {
      type: String,
      required: true,
    },
    sellUntil: {
      type: Date,
      required: true,
    },
    minCash: {
      type: Number,
      required: true,
    },
    sellability: {
      type: String,
      required: true,
    },
    contract: {
      type: String,
      required: true,
    },
    commissionPercent: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    loan: {
      type: String,
      required: true,
    },
    capitalAmmount: {
      type: Number,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    estimatedValue: {
      type: Number,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;