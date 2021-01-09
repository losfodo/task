const express = require('express') //chama express backend web
const app = express() //conecta a app
const db = require('./config/db')//importa banco de dados
const consign = require('consign')

//app.get('/', (req, res) => { //chegando nessa função.. get: pega de modo visivel a url:'/'
//    res.status(200).send('Meu backend!') //res chama a aplicação 200:ok enviando texto
//})

consign()// ajuda a carregar todos os modulos nos outros arquiavos sem necessidade de require
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')//cadastra toda a pasta api
    .then('./config/routes.js')//rotas usando consign
    .into(app)//passar app como parametro

    app.db = db //acesso ao db podendo fazer inseçoes alteraçoes etc..

app.listen(3000, () => {//porta 3000
    console.log('Backend executando...')//aparece no cosole do terminal nao do site..
})