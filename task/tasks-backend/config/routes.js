module.exports = app => {//rotas serão definidas aqui
    app.post('/signup', app.api.user.save)//nao necessario require pois consign faz o caminho centralizados no app
    app.post('/signin', app.api.auth.signin)

    app.route('/tasks')//rota das tasks
        .all(app.config.passport.authenticate())
        .get(app.api.task.getTasks)//metodos get lista
        .post(app.api.task.save)//e post de task salvar..

        app.route('/tasks/:id')//url rota
        .all(app.config.passport.authenticate())//authentificação passo por esse filtro para cada ação abaixo cada rota
        .delete(app.api.task.remove)

        app.route('/tasks/:id/toggle')
        .all(app.config.passport.authenticate())
        .put(app.api.task.toggleTask)//task concluida
}