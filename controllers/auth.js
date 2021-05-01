const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const {email, password} = req.body;
    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña inválidos. 1'
            });
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña inválidos. 2'
            });
        }

        // Generar token
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Errror inesperado.'
        });
    }
};

module.exports = {
    login
};