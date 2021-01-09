const config = require('../knexfile.js') //importar arquivo configuração banco de dados
const knex = require('knex')(config) // passa função tbm config

knex.migrate.latest([config]) //configuração de migração pode ser especificada ao inicializar a biblioteca
module.exports = knex //bota para exportar acessa banco de dados