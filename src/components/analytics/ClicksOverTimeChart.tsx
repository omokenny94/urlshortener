import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Click = {
  _id: string;
  timestamp: number;
};

type Props = {
  clicks: Click[];
};

export default function ClicksOverTimeChart({ clicks }: Props) {
  const groupedClicks = clicks.reduce<Record<string, number>>((acc, click) => {
    const date = new Date(click.timestamp).toLocaleDateString();

    acc[date] = (acc[date] || 0) + 1;

    return acc;
  }, {});

  const data = Object.entries(groupedClicks).map(([date, count]) => ({
    date,
    clicks: count,
  }));

  return (
    <div className=" border p-4">
      <h2 className="mb-4 font-semibold">Clicks Over Time</h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="clicks" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}