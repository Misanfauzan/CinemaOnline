'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.user, {
        as: "users",
        foreignKey: {
          name: "idUser",
        },
      });

      transaction.belongsTo(models.film, {
        as: "films",
        foreignKey: {
          name: "idFilms",
        },
      });
    }
  }
  transaction.init({
    idUser: DataTypes.INTEGER,
    idFilms: DataTypes.INTEGER,
    number_pay: DataTypes.INTEGER,
    status_pay: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};