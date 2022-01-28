'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
      }
    };
	return sequelize.define('user_wishlist', {
		user_id: DataTypes.STRING,
		wishList: DataTypes.STRING,
		wishSlots: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 5,
		},
	}, {
		timestamps: false,
	});
};