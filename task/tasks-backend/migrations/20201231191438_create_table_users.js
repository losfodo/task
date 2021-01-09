
exports.up = function(knex, Promise) {//up exemplo cria algo
    return knex.schema.createTable('users', table => {//cria a tabela user e passa função tabela abaixo..
        table.increments('id').primary()/*chave primaria id*/
        table.string('name').notNull()//notNull: não pode ser nulo campo obrigatorio
        table.string('email').notNull().unique()//unique: unico não aceita duplicidade
        table.string('password').notNull()
    })
};

exports.down = function(knex, Promise) { //down faz oposto tipo remove algo
    return knex.schema.dropTable('users')//excluir a tabela user
};
