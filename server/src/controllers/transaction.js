const { user, transaction, film } = require("../../models");
const { Op } = require("sequelize");

exports.getTransactions = async (req, res) => {
  try {
    let data = await transaction.findAll({      
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [        
        {
          model: user,
          as: "users",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }, 
        {
          model: film,
          as: "films",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },       
      ],                  
    });

    data = JSON.parse(JSON.stringify(data));
  
    data = data.map((item) => {
      return { 
        ...item, 
        image: process.env.PATH_FILE + item.image, 
        // imageFilm: process.env.PATH_FILE + item.films.image         
      };
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

exports.getTransactionsUser = async (req, res) => {
  try {
    const idUser = req.user.id;
    let data = await transaction.findAll({
      where: {        
        [Op.or]:[
          {
            [Op.and]: [{ status_pay: 'Approved' }, { idUser: idUser }],
          },
          {
            [Op.and]: [{ status_pay: 'Pending' }, { idUser: idUser }],
          }
      ]
      },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [        
        {
          model: user,
          as: "users",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }, 
        {
          model: film,
          as: "films",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },         
      ],            
    });

    data = JSON.parse(JSON.stringify(data));
  
    data = data.map((item) => {
      return { 
        ...item, 
        image: process.env.PATH_FILE + item.image, 
        imageFilm: process.env.PATH_FILE + item.films.image         
      };
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

exports.getTransactionsId = async (req, res) => {
  try {
    const idUser = req.user.id;
    let data = await transaction.findAll({
      where: {
        idUser
      },
      attributes: {
        exclude: ["updatedAt"],               
      },
      include: [        
        {
          model: user,
          as: "users",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }, 
        {
          model: film,
          as: "films",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },         
      ],            
    });

    data = JSON.parse(JSON.stringify(data));
  
    data = data.map((item) => {
      return { 
        ...item, 
        image: process.env.PATH_FILE + item.image, 
        imageFilm: process.env.PATH_FILE + item.films.image,                        
      };
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

exports.getTransactionsUserFilm = async (req, res) => {
  try {
    const idUser = req.user.id;
    const idFilms = req.params.id;
    let data = await transaction.findAll({
      where: {        
        [Op.or]:[
          {
            [Op.and]: [{ status_pay: 'Approved' }, { idUser: idUser }, {idFilms: idFilms}],
          },
          {
            [Op.and]: [{ status_pay: 'Pending' }, { idUser: idUser }, {idFilms: idFilms}],
          },
          {
            [Op.and]: [{ status_pay: 'Cancel' }, { idUser: idUser }, {idFilms: idFilms}],
          }
      ]
      },
      attributes: {
        exclude: ["createdAt"],
      },
      include: [        
        {
          model: user,
          as: "users",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }, 
        {
          model: film,
          as: "films",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },         
      ], 
    });

    data = JSON.parse(JSON.stringify(data));
  
    data = data.map((item) => {
      return { 
        ...item, 
        image: process.env.PATH_FILE + item.image, 
        imageFilm: process.env.PATH_FILE + item.films.image         
      };
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

exports.addTransaction = async (req, res) => {
  try {  
    const datas = {
      idUser: req.user.id,
      idFilms: req.body.idFilms,
      number_pay: req.body.number_pay,
      status_pay: 'Pending',
      image: req.file.filename,            
    };    

    let newTransaction = await transaction.create(datas);                

    let data = await transaction.findAll({
      where: {
        id: newTransaction.id,
      },
      include: [          
        {
          model: user,
          as: "users",            
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: film,
          as: "films",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }, 
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data))    

    res.send({
      status: "success",
      data
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateTransactionApproved = async (req, res) => {
  try {
    let { id } = req.body;

    const datas = {
      status_pay: 'Approved',
    };   

    await transaction.update(datas, {
      where: {
        id
      },
    });

    let data = await transaction.findOne({
        where: {
          id,
        },        
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
    });

    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      image: process.env.FILE_PATH + data.image,
    };

    res.send({
      status: "success",      
      data
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateTransactionCancel = async (req, res) => {
  try {
    let { id } = req.body;

    const datas = {
      status_pay: 'Cancel',
    };   

    await transaction.update(datas, {
      where: {
        id
      },
    });

    let data = await transaction.findOne({
        where: {
          id,
        },        
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
    });

    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      image: process.env.FILE_PATH + data.image,
    };

    res.send({
      status: "success",      
      data
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};