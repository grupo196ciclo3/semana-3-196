const models = require("../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.listar = async (req, res, next) => {
    
    try {
        const users = await models.user.findAll();
        res.status(200).json(users);
    } catch (error) {
        
        res.status(500).send({
            error: Error
        })
        next(error);
        
    }
}

exports.signin = async (req, res, next) => {    
    try {
        const user = await models.user.findOne({ where: {email: req.body.email}});
        if(user){
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if(passwordIsValid){
                const token = jwt.sign({
                    id: user.id,
                    name: user.nombre,
                    email: user.email,
                    // rol: user.rol,
                },
                "Soy una cadena secreta",
                {
                    expiresIn: 86400,
                })

                res.status(200).send({
                    auth: true,
                    accessToken: token,
                    // user: user,
                })

            }else{
                res.status(401).send({
                    auth: false,
                    accessToken: null,
                    razon: "Usuario y/o contraseña incorrectos"
                })
            }
        }else{
            res.status(404).send("Usuario y/o Contraseña Incorrectas")
        }
    } catch (error) {

        res.status(500).send({
            error: Error
        })
        next(error);

    }
}

exports.register = async (req, res, next) => {
    
    try {

        const user = await models.user.findOne({ where: {email: req.body.email}});

        if(!user){

            req.body.password = bcrypt.hashSync(req.body.password, 10); // Encriptar la contraseña
            const users = await models.user.create(req.body);
            res.status(200).json(users)

        }else{

            res.status(404).json({
                error: "Correo ya existente"                
            })

        }
    } catch (error) {
        
        res.status(500).send({
            error: Error
        })
        next(error);
        
    }
}

exports.actualizar = async (req, res, next) => {
    
    try {

        const user = await models.user.findOne({where: {email: req.body.email}})

        if(user){

            const passwordIsValid= bcrypt.compareSync(req.body.password, user.password);

            if(!passwordIsValid){

                req.body.password = bcrypt.hashSync(req.body.password, 10);
                const newPassword = await models.user.update({password: req.body.password}, { where: { email: user.email} })                
                res.status(200).json({
                    messaege: "Contraseña actualizada"
                })

            }else{
                res.status(404).json({
                    error: "No puede poner la misma contraseña"                
                })
            }
        }
    } catch (error) {
        
        res.status(500).send({
            error: Error
        })
        next(error);
        
    }
}