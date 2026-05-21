import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movement = sequelize.define('Movement', {
    type: { type: DataTypes.ENUM('IN', 'OUT'), allowNull: false },
    productName: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING },
    operator: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

export default Movement;