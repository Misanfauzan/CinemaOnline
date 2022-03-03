const { user } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({      
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.user;

    const data = await user.findOne({
      where: {
        id,
      },      
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });                

    res.send({
      status: "success",
      data:{
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: process.env.PATH_FILE + data.image
      }    
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.user.id;

    const datas = {
      name: req?.body?.name,
      phone: req?.body.phone,
      email: req?.body.email,
      image: req?.file?.filename,
    };    

    const newUser = await user.update(datas, {
      where: {
        id
      },
    });

    const data = await user.findOne({
      where: {
        id,
      },      
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    }); 

    res.send({
      status: "success",
      data:{
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: process.env.PATH_FILE + data.image
      }    
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};