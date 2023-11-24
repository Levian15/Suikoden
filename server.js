const express = require('express');
const cors = require('cors');
require('dotenv').config();
const usersRouter=require('./rutes/users');


class Server {
    constructor(){
        this.app=express();//instancia de express
        this.port=process.env.PORT;//puerto para el servidor

        //http://localhost:3000/api/v1/personajes
        this.basePath=`/api/v1`;

        this.usersPath=`${this.basePath}/personajes`;
        this.middlewares();
        this.routes();


    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());//Para poder interpretar texto
    }

    routes(){
        this.app.use(this.usersPath, usersRouter);
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log("Listening on port"+this.port);

        })
    }

}

module.exports = Server;