//const { Sequelize } = require('sequelize');
import { Sequelize, Transaction } from 'sequelize'

const sequelize = new Sequelize(
    'edu_sims_test', 'am6110', 'eky5mc9s', {
        host: 'pgserver.mau.se',
        dialect: 'postgres',
        port : 5432,
        pool : {
            max: 90,
            min: 0
        }
    }
);

export default sequelize;

