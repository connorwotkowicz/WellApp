import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; 

class Booking extends Model {
  public id!: number;
  public userId!: number;
  public providerId!: number;
  public sessionTime!: Date;
  public status!: string; 

  
}

Booking.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    providerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sessionTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'booked', 
    },
  },
  {
    sequelize,
    tableName: 'bookings',
  }
);

export default Booking;
