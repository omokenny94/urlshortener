import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Click = {
  referrer?: string;
};

type Props = {
  clicks: Click[];
};

export default function ReferrerChart({ clicks }: Props) {
  const referrers = clicks.reduce<Record<string, number>>((acc, click) => {
    const referrer = click.referrer || "Direct";

    acc[referrer] = (acc[referrer] || 0) + 1;

    return acc;
  }, {});

  const data = Object.entries(referrers).map(([referrer, clicks]) => ({
    referrer,
    clicks,
  }));

  return (
    <div className=" border p-4">
      <h2 className="mb-4 font-semibold">Top Referrers</h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="referrer" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}