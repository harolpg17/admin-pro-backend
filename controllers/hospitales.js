const { respone } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre email img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();
        
        res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al crear hospital."
        });
    }
}

const actualizarHospital = async(req, res = response) => {

    try {
        const uid = req.uid;
        const hospitalId = req.params.id;
        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {
            return res.status(404).json({
                ok:false,
                msg: 'Hospital no encontrado.'
            });
        }

        //hospital.nombre = req.body.nombre;
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalAct = await Hospital.findByIdAndUpdate(hospitalId, cambiosHospital, {new: true});

        res.json({
            ok: true,
            hospital: hospitalAct
        });     
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
}

const borrarHospital = async(req, res = response) => {

    try {

        const hospitalId = req.params.id;
        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {
            return res.status(404).json({
                ok:false,
                msg: 'Hospital no encontrado.'
            });
        }

        await Hospital.findByIdAndDelete(hospitalId);

        res.json({
            ok: true,
            msg: 'Hospital Eliminado.'
        });     
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
}

module.exports= {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
};