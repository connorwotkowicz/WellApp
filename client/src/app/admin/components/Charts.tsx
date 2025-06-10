import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  labels: string[];
  data: number[];   
  title: string;   
}

const ChartComponent: React.FC<ChartProps> = ({ labels, data, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <h3>{title}</h3>
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;
