import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
    sku: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    provider: { type: DataTypes.STRING },
    batch: { type: DataTypes.STRING },
    unitPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalValue: { type: DataTypes.FLOAT, defaultValue: 0 },
    location: { type: DataTypes.STRING },
    imageUrl: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    entryDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

export default Product;