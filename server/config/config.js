//----------------------------
//          Puerto
//----------------------------
process.env.PORT = process.env.PORT || 3000;

//----------------------------
//          Entorno
//----------------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//----------------------------
//      Base de Datos
//----------------------------

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//----------------------------
//  Vencimiento del token
//----------------------------
//60 segundos * 60 minutos * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

//----------------------------
//  SEED de autenticación
//----------------------------

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//----------------------------
//  GOOGLE client ID
//----------------------------
process.env.CLIENT_ID = process.env.CLIENT_ID || '40779431022-trf8c1k4j3urrcvdamkemtfd9dj3rt8j.apps.googleusercontent.com';