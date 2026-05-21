import { Op } from 'sequelize';
import Product from '../models/Product.js';
import Movement from '../models/Movement.js';

export const WarehouseController = {
    // Cadastro de Entrada
    async registerInput(req, res) {
        try {
            const data = req.body;
            data.totalValue = data.quantity * data.unitPrice; // Cálculo Automático
            
            const count = await Product.count();
            const prefix = data.category.substring(0, 3).toUpperCase();
            data.sku = `VER-${prefix}-${String(count + 1).padStart(4, '0')}`;

            const product = await Product.create(data);
            await Movement.create({ 
                type: 'IN', productName: data.name, quantity: data.quantity, 
                reason: 'Recebimento', operator: 'Admin' 
            });
            
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Listar Produtos Cadastrados (Usado no Estoque e no Dropdown de Saída)
    async listProducts(req, res) {
        try {
            const products = await Product.findAll({ order: [['name', 'ASC']] });
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Lógica Rígida de Saída (FIFO)
    async performPicking(req, res) {
        const { name, quantity, reason, operator } = req.body;
        let qtyToPull = parseInt(quantity);

        try {
            const batches = await Product.findAll({
                where: { name, quantity: { [Op.gt]: 0 } },
                order: [['entryDate', 'ASC']]
            });

            let totalAvailable = batches.reduce((sum, b) => sum + b.quantity, 0);
            if (qtyToPull > totalAvailable) {
                return res.status(400).json({ error: `Estoque insuficiente. Disponível: ${totalAvailable}` });
            }

            for (let batch of batches) {
                if (qtyToPull === 0) break;
                
                if (batch.quantity >= qtyToPull) {
                    batch.quantity -= qtyToPull;
                    batch.totalValue = batch.quantity * batch.unitPrice; // Atualiza o valor
                    qtyToPull = 0;
                } else {
                    qtyToPull -= batch.quantity;
                    batch.quantity = 0;
                    batch.totalValue = 0;
                }
                await batch.save();
            }

            await Movement.create({ type: 'OUT', productName: name, quantity, reason, operator });
            res.json({ message: 'Saída FIFO processada com sucesso.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Dados para o Dashboard Interativo
    async getDashboardStats(req, res) {
        try {
            const products = await Product.findAll();
            const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
            const totalValue = products.reduce((sum, p) => sum + p.totalValue, 0);
            const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;

            res.json({ totalItems, totalValue, lowStock, totalSKUs: products.length });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};