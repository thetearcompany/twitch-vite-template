import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LineChartProps {
  data: Array<{
    timestamp: number;
    value: number;
  }>;
}

export function LineChart({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsLineChart data={data}>
        <XAxis 
          dataKey="timestamp" 
          type="number"
          domain={['auto', 'auto']}
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => new Date(value).toLocaleTimeString()}
          formatter={(value: number) => [value.toFixed(2), 'Value']}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
} 