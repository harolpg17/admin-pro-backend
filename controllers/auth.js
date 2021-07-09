const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSingIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const {name, email, picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // Existe el usuario
            usuario = usuarioDB;
            usuario.google = true;            
        }

        // Guardar en DB
        await usuario.save();

        // Generar token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: 'Google singIn',
            token
        });
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: error
        });
    }

};

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar token
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    login,
    googleSingIn,
    renewToken
};