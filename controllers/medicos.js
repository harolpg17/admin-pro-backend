const { respone } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario','nombre email')
        .populate('hospital','nombre');
    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();
        
        res.json({
            ok: true,
            medico: medicoDB
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al crear médico."
        });
    }
}

const actualizarMedico = async(req, res = response) => {

    try {
        const uid = req.uid;
        const medicoId = req.params.id;
        const medico = await Medico.findById(medicoId);

        if (!medico) {
            return res.status(404).json({
                ok:false,
                msg: 'Médico no encontrado.'
            });
        }
    
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoAct = await Medico.findByIdAndUpdate(medicoId, cambiosMedico, {new: true});

        res.json({
            ok: true,
            hospital: medicoAct
        }); 
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al crear médico."
        });
    }
    
}

const borrarMedico = async(req, res = response) => {
    try {

        const medicoId = req.params.id;
        const medico = await Medico.findById(medicoId);

        if (!medico) {
            return res.status(404).json({
                ok:false,
                msg: 'Médico no encontrado.'
            });
        }

        await Medico.findByIdAndDelete(medicoId);

        res.json({
            ok: true,
            msg: 'Médico Eliminado.'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
};