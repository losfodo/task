const { authSecret } = require('../.env')//importa authSecret para gerar senha segurança de .env
const jwt = require('jwt-simple')//decodificação
const bcrypt = require('bcrypt-nodejs')//para comparar senha 

module.exports = app => {
    const signin = async (req, res) => {//
        if (!req.body.email || !req.body.password) {//se a senha falta ou email faltar
            return res.status(400).send('Dados incompletos')//retorna 400 erro
        }

        const user = await app.db('users')//await esperar a promise ser resolvida do usuario
        .whereRaw("LOWER(email) = LOWER(?)", req.body.email)//pega usuario onde email é igual ao feito signin usando lower e não de erro de login com letra maiuscula ou minuscula
        .first()//para pegar primeiro usuario com email acima

        if (user) {// cumprindo o await promisse acima.... comtinua users
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {//compara a senha recebe na requisição com a do banco de dados senha.. dando Match true
                if (err || !isMatch) {//se der erro ou não match
                    return res.status(401).send('A senha informada é inválida!') //retorna erro
                }

                const payload = {//caso deu certo.. payload: valor armazenado dentro do token
                    id: user.id
                 //   name: user.name,
                 //   email: user.email
                }

                res.json({//manda como resposta em json
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret), //alem do token enviado
                })
            })
        } else {
            res.status(400).send('Usuário não cadastrado!')
        }
    }
    return { signin } //retornando signin pra funcionar tudo acima
}