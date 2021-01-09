const bcrypt = require('bcrypt-nodejs') //para a senha não ser armazenada limpa e não ser hackeado criptografia

module.exports = app => {// acesso dos dados se baseia exemplo app.db para dados .. app.user usuarios
    const obterHash = (password, callback) => {//obterHash de criptografia o numero aleatorio e o original senha
        bcrypt.genSalt(10, (err, salt) => {//10 rodadas para gerar um numero..salt: é salto q vai gerar valor aleatorio ou hash
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))//obtendo assim hash
        })
    }

    const save = (req, res) => {//salva o usuario no banco de dados
        obterHash(req.body.password, hash => {//body:bodyParse
            const password = hash //senha sera usada é o hash gerado aleatoriamente não a padrão

            app.db('users')//dados usuario abaixo
                .insert({ 
                    name: req.body.name,
                    email: req.body.email.toLowerCase(), //iniciar com letra minuscula ao digitar email 
                    password
                })
                .then(_ => res.status(204).send())//linha 204 reposta de sucesso com nada q queira retornar
                .catch(err => res.status(400).json(err))//caso de error 500 linha de erro pro lado do servidor, 400 erro do cliente
        })
    }

    return { save }//acima dos codigos oq se quer retorna é o save apenas
}