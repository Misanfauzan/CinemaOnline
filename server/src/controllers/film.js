const { film, category, filmCategory } = require("../../models");
const sequelize = require('sequelize')

exports.getFilms = async (req, res) => {
    try {
      let data = await film.findAll({
        include: [          
          {
            model: category,
            as: "categories",            
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },        
        order: [
          sequelize.fn( 'RAND' ),
        ]
      });
  
      data = JSON.parse(JSON.stringify(data));
  
      data = data.map((item) => {
        return { ...item, image: process.env.PATH_FILE + item.image };
      });
  
      res.send({
        status: "success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server Error",
      });
    }
};

exports.getFilmsLimit = async (req, res) => {
  try {
    let data = await film.findAll({
      include: [          
        {
          model: category,
          as: "categories",            
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },        
      order: [
        sequelize.fn( 'RAND' ),
      ],
      limit: 3
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return { ...item, image: process.env.PATH_FILE + item.image };
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getFilm = async (req, res) => {
    try {
      const { id } = req.params;
      let data = await film.findOne({
        where: {
          id,
        },
        include: [          
          {
            model: category,
            as: "categories",
            through: {
              model: filmCategory,
              as: "bridge",
              attributes: [],
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
  
      data = JSON.parse(JSON.stringify(data));
  
      data = {
        ...data,
        image: process.env.PATH_FILE + data.image,
      };
  
      res.send({
        status: "success",
        data: [
          data
        ]
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server Error",
      });
    }
};

exports.addFilm = async (req, res) => {
  try {
    let { categoryId } = req.body;
    categoryId = categoryId.split(",");

    const data = {
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      image: req.file.filename,
      link: req.body.link,
      filmId: Math.floor(Math.random() * 1000000000)
    };

    let newFilm = await film.create(data);

    const filmCategoryData = categoryId.map((item) => {
      return { idFilm: newFilm.id, idCategory: parseInt(item) };
    });

    await filmCategory.bulkCreate(filmCategoryData);

    let filmData = await film.findOne({
      where: {
        id: newFilm.id,
      },      
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    filmData = JSON.parse(JSON.stringify(filmData));

    res.send({
      status: "success",
      data: {
        ...filmData,
        image: process.env.PATH_FILE + filmData.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};