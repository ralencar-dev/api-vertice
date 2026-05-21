import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import { WarehouseController } from './controllers/WarehouseController.js';

const app = express();
app.use(cors());
app.use(express.json());

// Sincronização do Banco
sequelize.sync({ alter: true }).then(() => console.log('Vértice Premium DB: Online'));

// Rotas da API
app.post('/api/products', WarehouseController.registerInput);
app.get('/api/products', WarehouseController.listProducts);
app.post('/api/movements/out', WarehouseController.performPicking);
app.get('/api/dashboard', WarehouseController.getDashboardStats);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor de Luxo rodando na porta ${PORT}`));