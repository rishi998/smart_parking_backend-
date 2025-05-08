// import mongoose, { mongo } from "mongoose";

// const userschema=mongoose.Schema({
//   email:{
//     type:String,
//     required:true,
//     unique:true,
//   },
//   name:{
//     type:String,
//     required:true,
//     unique:false,
//   },
//   password:{
//     type:String,
//     required:true,
//   },
//   phone:{
//     type:Number,
//     unique:false,
//     required:true,
//   },
//   isverified:{
//     type:Boolean,
//     default:true,
//   },
//   verificationCode:String,
//   accesstoken:{
//     type:String,
//     unique:true,
//     // required:false;
//   }
// },{timestamps:true});

// const usermodel=mongoose.model("user",userschema);
// export default usermodel;

import { DataTypes } from "sequelize";
import bcrypt from 'bcryptjs';

export default function(sequelize) {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    isverified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    verificationCode: {
      type: DataTypes.STRING
    },
    accesstoken: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Instance method for password comparison
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Association method
  User.associate = function(models) {
    // Define associations here if needed
    // Example:
    // User.hasMany(models.Booking, { foreignKey: 'userId' });
  };

  return User;
}