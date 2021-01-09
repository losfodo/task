const { authSecret } = require('../.env')
const passport = require('passport')//seria a chave de entrada de olhar o token e ver se continua ou é barrado o acesso
const passportJwt = require('passport-jwt')//estrategia de authentificação
const { Strategy, ExtractJwt } = passportJwt //ExtractJwt: estrair do cabeçario da requisição

module.exports = app => {
    const params = {//parametros
        secretOrKey: authSecret, //chave de segredo
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//request vem do header com token
    }

    const strategy = new Strategy(params, (payload, done) => {//passando as estrategia, payload:token
        app.db('users')//acessa tabela users
            .where({ id: payload.id })//faz consulta no id
            .first()//pega o primeiro usuario
            .then(user => {
                if (user) {//se usuario tiver presente
                    done(null, { id: user.id, email: user.email })//passa done id e email
                } else {
                    done(null, false)//ou falso não authentificou
                }
            })
            .catch(err => done(err, false))//caso de erro
    })
    passport.use(strategy)

    return {//retornando objeto abaixo..
        initialize: () => passport.initialize(),//inicializar
        authenticate: () => passport.authenticate('jwt', { session: false })// e authenticar com jwt e session falsa sem sessão envolvida
    }
}