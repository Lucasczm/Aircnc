const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

UserSchema.pre('save', async function HasPassword(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const hash = await new Promise((resolve, reject) => {
    bcrypt.hash(user.password, saltRounds, function cb(err, newHash) {
      if (err) return reject(err);
      return resolve(newHash);
    });
  });
  user.password = hash;
  next();
});

UserSchema.methods.comparePassword = async function comparePassword(mPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(mPassword, this.password, function cb(err, isMatch) {
      if (err) return reject(err);
      return resolve(isMatch);
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
