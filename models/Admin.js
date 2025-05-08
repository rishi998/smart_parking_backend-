// import mongoose, { mongo } from "mongoose";

// const adminschema=mongoose.Schema({
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
//   accesstoken:{
//     type:String,
//     unique:true,
//   }
// },{timestamp:true});

// const adminmodel=mongoose.model("admin",adminschema);
// export default adminmodel;

import { DataTypes } from "sequelize";
import bcrypt from 'bcryptjs';

export default function(sequelize) {
  const Admin = sequelize.define("Admin", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'admin_email_unique',
        msg: 'This email is already registered'
      },
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        len: {
          args: [2, 50],
          msg: 'Name must be between 2 and 50 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        len: {
          args: [8, 100],
          msg: 'Password must be between 8 and 100 characters'
        }
      }
    },
    accesstoken: {
      type: DataTypes.STRING,
      unique: {
        name: 'admin_token_unique',
        msg: 'Access token must be unique'
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(admin.password, salt);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(admin.password, salt);
        }
      }
    }
  });

  // Instance method for password comparison
  Admin.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Association method
  Admin.associate = function(models) {
    // Define relationships here if needed
    // Example:
    // Admin.hasMany(models.SomeModel, { foreignKey: 'adminId' });
  };

  return Admin;
}