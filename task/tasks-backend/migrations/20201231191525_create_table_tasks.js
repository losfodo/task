
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tasks', table => {//função para criar
        table.increments('id').primary()
        table.string('desc').notNull()
        table.datetime('estimateAt')
        table.datetime('doneAt')//data das tasks
        table.integer('userId').references('id')// integer:inteiro do id tabela users
            .inTable('users').notNull() //tanela users obrigatorio
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tasks')//função dropar tabela
};
