import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import { WarehouseController } from './controllers/WarehouseController.js';

const app = express();

// ==========================================
// 1. MIDDLEWARES GLOBAIS (A Ordem é Crucial)
// ==========================================

// O CORS DEVE ser a primeira regra do servidor.
// 'origin: *' garante que sua URL da Vercel consiga ler os dados.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Permite que o servidor entenda JSON (o que vem do front-end)
app.use(express.json());

// ==========================================
// 2. ROTAS DA API
// ==========================================

// Rota raiz (Health Check) - Ótima para você testar no navegador se o Render subiu
app.get('/', (req, res) => {
    res.json({ message: "🚀 Backend Vértice WMS Premium está Online!" });
});

// Rotas do WarehouseController
app.post('/api/products', WarehouseController.registerInput);
app.get('/api/products', WarehouseController.listProducts);
app.post('/api/movements/out', WarehouseController.performPicking);
app.get('/api/dashboard', WarehouseController.getDashboardStats);

// ==========================================
// 3. INICIALIZAÇÃO DE BANCO E SERVIDOR
// ==========================================

// Tenta sincronizar o banco e avisa no console do Render se deu certo
sequelize.sync({ alter: true })
    .then(() => {
        console.log('📦 Vértice Premium DB: Sincronizado com sucesso!');
    })
    .catch((error) => {
        console.error('❌ Erro ao sincronizar o SQLite:', error);
    });

// A porta process.env.PORT é obrigatória para o Render funcionar!
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor Vértice logístico rodando na porta ${PORT}`);
});