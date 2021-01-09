const bodyParser = require('body-parser')//parse no body da requisição
const cors = require('cors')//cors: habilitar requisiçoes de origens diferentes

module.exports = app => { //app estado global da aplicação com dados compartilhados
    app.use(bodyParser.json()) //interpretar em json
    app.use(cors({ //habilita qualquer origin:origem com cors
        origin: '*'
    }))
}