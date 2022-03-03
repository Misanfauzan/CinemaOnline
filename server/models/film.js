'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      
      
      film.belongsToMany(models.category, {
        as: "categories",
        through: {
          model: "filmCategory",
          as: "bridge",
        },
        foreignKey: "idFilm",
      });
      film.hasMany(models.transaction, {
        as: "films",
        foreignKey: {
          name: "idFilms",
        },
      });
    }
  }
  film.init({
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    link: DataTypes.STRING,
    desc: DataTypes.STRING,
    price: DataTypes.INTEGER,
    filmId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'film',
  });
  return film;
};