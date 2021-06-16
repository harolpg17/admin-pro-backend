const { response } = require('express');

const Usuario = require('../models/usuario');
const Medicos = require('../models/medico');
const Hopitales = require('../models/hospital');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');
    
    // const usuarios = await Usuario.find({ nombre: regex });
    // const medicos = await Medicos.find({ nombre: regex });
    // const hospitales = await Hopitales.find({ nombre: regex });

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medicos.find({ nombre: regex }),
        Hopitales.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });
}

const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medicos.find({ nombre: regex })
                            .populate('usuario', 'nombre img')
                            .populate('hospital', 'nombre img');
            break;
        case 'hospitales':
            data = await Hopitales.find({ nombre: regex })
                            .populate('usuario', 'nombre img');
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;    
        default:
            res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser medicos/hospitales/usuarios'
            });
            break;
    }

    res.json({
        ok: true,
        resultado: data
    });
}

module.exports= {
    getTodo,
    getDocumentosColeccion
};