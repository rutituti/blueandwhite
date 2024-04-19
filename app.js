const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const cokkieParser = require('cookie-parser');
const session = require('express-session');


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false})); //se pone el body parser hasta arriba para que se use en todas rutas
app.use(bodyParser.json()); // json -> java script object notation 

//fileStorage: Es nuestra constante de configuración para manejar el almacenamiento
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'public/uploads');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null, new Date().getSeconds() + '' + new Date().getDay() + '' + new Date().getMonth() + '' + new Date().getYear() + file.originalname);
    },
});

app.use(multer({ storage: fileStorage }).single('archivo'));

app.use(cokkieParser());
app.use(session({
    secret: 'mi string secreto que debe ser un string aleatorio muy largo, no como éste', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita

}));

app.use('/home', (request, response, next) => {
   
    response.send('Hola mundo'); 
});

app.use((request, response, next) => {
    
    response.status(404);
    response.sendFile(path.join(__dirname,'views', 'error.html'));
    //Nunca poner un next() despues de una respuesta, puede causar errores 
});



app.listen(3000);