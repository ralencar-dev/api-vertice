import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './vertice_database.sqlite',
    logging: false // Mantém o terminal limpo para o ambiente corporativo
});

export default sequelize;