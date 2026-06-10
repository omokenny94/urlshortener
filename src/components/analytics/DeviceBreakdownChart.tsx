import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Click = {
  device?: string;
};

type Props = {
  clicks: Click[];
};

export default function DeviceBreakdownChart({
  clicks,
}: Props) {
  const devices = clicks.reduce<
    Record<string, number>
  >((acc, click) => {
    const device =
      click.device || "unknown";

    acc[device] =
      (acc[device] || 0) + 1;

    return acc;
  }, {});

  const data = Object.entries(
    devices
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#000000",
    "#5e5e5e",
    "#9b9b9b",
    "#d0d0d0",
  ];

  return (
    <div className=" border p-4">
      <h2 className="mb-4 font-semibold">
        Device Breakdown
      </h2>

      <div className="h-72">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {data.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}