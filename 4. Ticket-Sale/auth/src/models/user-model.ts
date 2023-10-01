import mongoose from 'mongoose';
import { PasswordManager } from '@abticketsale/common';

// interface to describe properties required to create new user
interface UserAttributes {
  email: string;
  password: string;
}

// interface to describe properties that User document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// interface to describe properties that User model has
interface UserModelAttributes extends mongoose.Model<any> {
  build(attributes: UserAttributes): UserDoc;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // properties to help mongoose to take user doc and turn it into JSON as 'ret object'
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

UserSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

// DOCUMENT MIDDLEWARE (this object points to document, do not work with update)
UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified otherwise we will hash already hashed password
  if (!this.isModified('password')) return next();

  this.password = await PasswordManager.toHash(this.password);

  next();
});

// <> arguements to function "model", instead of being data-type or actual values, they are "type"
const User = mongoose.model<UserDoc, UserModelAttributes>('User', UserSchema);

export { User };
