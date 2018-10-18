//--------------------
//Verificar token
//--------------------

const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};

//--------------------
//Verificar AdminRole
//--------------------

let verifcaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario no admin'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verifcaAdmin_Role
}