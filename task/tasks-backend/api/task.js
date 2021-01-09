const moment = require('moment')//utilizado para validar, manipular e fazer o parse de datas no JavaScript

module.exports = app => {
    const getTasks = (req, res) => {// função middleware
        const date = req.query.date ? req.query.date //recebe uma data
            : moment().endOf('day').toDate()//pega data horario de hj

        app.db('tasks')//banco de dados de tasks
            .where({ userId: req.user.id })//usuario tera id apartir token req
            .where('estimateAt', '<=', date) //datas estimadas menor q a data calculada
            .orderBy('estimateAt')//ordenar pela data estimada
            .then(tasks => res.json(tasks))//convertendo tudo para json
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {//para salvar a task
        if (!req.body.desc.trim()) {//se não mandou a descrição.trim:espaço em branco..
            return res.status(400).send('Descrição é um campo obrigatório')//retorna erro
        }

        req.body.userId = req.user.id//colocando userId para request para completar

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())//caso de certo..
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {//remover a task
        app.db('tasks')//a tabela
            .where({ id: req.params.id, userId: req.user.id })//receber remover id q esta no request msm q quer remover
            .del()//delete
            .then(rowsDeleted => {//entra then
                if (rowsDeleted > 0) {//se quantidade de linha maior q 0..
                    res.status(204).send()//deletou
                } else {//erro..
                    const msg = `Não foi encontrada task com id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const updateTaskDoneAt = (req, res, doneAt) => {// a data de conclusão vai ser alternada de acordo com q foi passado
        app.db('tasks')//passa na tabela
            .where({ id: req.params.id, userId: req.user.id })//no id expecificado
            .update({ doneAt })//faz update na conclusão
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {//alternancia de comcluido ou pendente a task
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if (!task) {//se task não existir
                    const msg = `Task com id ${req.params.id} não encontrada.` //retorna msg erro
                    return res.status(400).send(msg)
                }

                const doneAt = task.doneAt ? null : new Date()//se passou existe.. ao concluido retorna nulo caso não new date
                updateTaskDoneAt(req, res, doneAt)//passando estes parametros
            })
            .catch(err => res.status(400).json(err))
    }

    return { getTasks, save, remove, toggleTask }//retornando assim tudo..
}

