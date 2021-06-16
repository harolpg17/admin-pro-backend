const path = require('path');
const fs = require('fs');
const { response } = require("express");

const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizarImagen");

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        res.status(400).json({
            ok: false,
            msg: 'El tipo selecionado no es médico, usuario o hospital'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo.'
        });
    }

    // Procesar imagen
    const file = req.files.image;

    const nombreCortado = file.name.split('.');
    const extArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extensión
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if (!extensionesValidas.includes(extArchivo)) {
        res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida.'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extArchivo}`;

    // Path para guardar la imagen
    const path = `./upload/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen.'
            });
        }

        // Actualizar la base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido.',
            nombreArchivo
        });
    });

}

const retornarImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    console.log(tipo)
    console.log(foto)

    let pathImg = path.join(__dirname, `../upload/${tipo}/${foto}`);

    // imagen por defecto
    if (!fs.existsSync(pathImg)) {
        pathImg = path.join(__dirname, `../upload/no-available.jpg`);
    } 
    
    res.sendFile(pathImg);
}

module.exports = {
    fileUpload,
    retornarImagen 
}