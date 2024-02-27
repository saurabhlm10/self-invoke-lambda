import mongoose from 'mongoose';

const CollectionIGPageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    followersCount: {
      type: Number,
      required: true,
    },
    link: {
      type: String,
      // required: true,
    },
    page: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CollectionIGPageSchema.pre('save', function (next) {
  this.link = 'https://www.instagram.com/' + this.username;
  next();
});

const CollectionIGPage = mongoose.model(
  'CollectionIGPage',
  CollectionIGPageSchema
);

export default CollectionIGPage;
