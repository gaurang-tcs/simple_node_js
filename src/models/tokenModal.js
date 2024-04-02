const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Tokens extends Model { }

Tokens.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING(3000),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Tokens',
        tableName: 'tokens',
        timestamps: true,
        underscored: true,
    }
);

module.exports = Tokens;