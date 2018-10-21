    const express = require('express');
    const { verificaToken } = require('../middlewares/autenticacion');

    let app = express();
    let Producto = require('../models/producto');

    //#region Obtener todos los productos
    app.get('/producto', verificaToken, (req, res) => {
        let desde = req.params.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        Producto.find({ disponible: true })
            .skip(desde)
            .limit(limite)
            .sort('nombre')
            .populate('categoria', 'descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });
            })

    });
    //#endregion

    //#region Obtener un producto por ID
    app.get('/producto/:id', (req, res) => {
        let id = req.params.id;

        Producto.findById(id)

        .populate('categoria', 'descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, productoDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!productoDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'El ID no es correcto'
                        }
                    });
                }


                res.json({
                    ok: true,
                    producto: productoDB
                });

            });
    });
    //#endregion

    //#region Buscar productos
    app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

        let termino = req.params.termino;

        let expReg = new RegExp(termino, 'i');

        Producto.find({ nombre: expReg })
            .populate('categoria', 'nombre')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                })

            });

    });
    //#endregion


    //#region Crear un nuevo producto
    app.post('/producto', verificaToken, (req, res) => {
        let body = req.body;

        let producto = new Producto({
            usuario: req.usuario._id,
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: body.categoria
        });

        producto.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                producto: productoDB
            });
        });

    });
    //#endregion

    //#region Actualizar un producto por ID
    app.put('/producto/:id', verificaToken, (req, res) => {
        let id = req.params.id;
        let body = req.body;

        let detProducto = {
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: body.categoria
        }

        Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'el id no existe'
                    }
                });
            }

            productoDB.nombre = body.nombre;
            productoDB.precioUni = body.precioUni;
            productoDB.categoria = body.categoria;
            productoDB.disponible = body.disponible;
            productoDB.descripcion = body.descripcion;

            productoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto: productoGuardado
                })

            });


        });



    });
    //#endregion

    //#region Borrar un producto por ID
    app.delete('/producto/:id', verificaToken, (req, res) => {
        let id = req.params.id;

        Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            productoDB.disponible = false;

            productoDB.save((err, productoBorrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!productoDB) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    producto: productoBorrado,
                    message: 'Producto borrado'
                })

            });

        })
    });
    //#endregion

    module.exports = app;