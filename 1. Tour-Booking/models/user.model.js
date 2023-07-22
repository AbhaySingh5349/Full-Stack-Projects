const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');
const config = require('../config/config');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'name not provided '],
    minlength: [2, 'minimum 2 characters required in name'],
    maxlength: [30, 'number of characters in name exceeding 30'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'email not provided'],
    unique: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    trim: true,
    required: [
      true,
      'password must contain at least one digit, alphabet and special character',
    ],
    minLength: 3,
    // not exposing hashed password for any end-point other than /register (handled in code while token generation), for other we need to do: query.select('+password')
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!! (since 'this' is not defined on update)
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedTimestamp: Date,
  resetPasswordToken: String,
  resetPasswordExpiresTimestamp: Date,
  photo: {
    type: String,
    default: 'profileImage.jpg',
  },
  activeStatus: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// since arrow function do not have their own 'this', so we use normal function notation
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return user != null;
};

userSchema.statics.isStrongPassword = async (password) => {
  if (
    !password.match(/\d/) ||
    !password.match(/[a-zA-Z]/) ||
    !password.match(/[!@#$%^&*(),.?":{}|<>]/)
  ) {
    return false;
  }
  return true;
};

// instance method which is available to all documents of collection
userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.isPasswordChangedAfterTokenGeneration = function (
  jwtTimestamp,
) {
  if (this?.passwordChangedTimestamp) {
    const changedTimestamp = Math.floor(
      this.passwordChangedTimestamp.getTime() / 1000,
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpiresTimestamp =
    Date.now() + config.reset_token_expiration_minutes * 60 * 1000;

  return resetToken;
};

// DOCUMENT MIDDLEWARE (this object points to document, do not work with update)
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next(); // Only run this function if password was actually modified

  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  this.passwordConfirm = undefined; // Delete passwordConfirm field

  // sometimes saving to DB is bit slower than generating jwt token, so we can modify this timestamp by -1 sec
  this.passwordChangedTimestamp = Date.now() - 1000;

  next();
});

// QUERRY MIDDLEWARE (runs before any query)
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  33;
  // this.find({ activeStatus: true }); this will not work for previous records if 'activeStatus' field was added later
  this.find({ activeStatus: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
