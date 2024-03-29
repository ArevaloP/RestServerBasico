const {response, request} = require('express');

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {


    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    // const usuarios = await Usuario.find(query)
    //   .skip(Number(desde))
    //   .limit(Number(limite));
    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
    ]);

    res.json({
      total, 
      usuarios
    });
  }

const postUsuarios = async(req, res = response) => {

    


    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({
      nombre, 
      correo, 
      password, 
      rol
    });

    //Verificar correo
    

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    //Guardar
    await usuario.save();

    res.json(usuario);
  }

const putUsuarios = async(req, res = response) => {

    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    //TODO validar contra DB 
    if(password){
      //Encriptar contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
  }
 
const deleteUsuarios = async(req, res = response) => {

    const {id} = req.params;

    // const uid = req.uid;

    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    

    return res.json(usuario);
  }

  module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios
  }
