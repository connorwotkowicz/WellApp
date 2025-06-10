import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'roro', 
  
  database: 'wellness_db',   
});

export default sequelize;
