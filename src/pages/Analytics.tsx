import Navbar from "../components/header/Header";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ClicksOverTimeChart from "../components/analytics/ClicksOverTimeChart";
import DeviceBreakdownChart from "../components/analytics/DeviceBreakdownChart";
import ReferrerChart from "../components/analytics/ReferrerChart";
import Footer from "../components/footer/Footer";

export default function Analytics() {
  const { slug } = useParams();

  const analytics = useQuery(
    api.links.getAnalytics,
    slug ? { slug } : "skip"
  );

  if (analytics === undefined) {
    return <p>Loading analytics...</p>;
  }

  if (!analytics) {
    return <p>Analytics not found.</p>;
  }

  return (

    <div className="max-w-7xl mx-auto gap-4 w-full">
      <Navbar />
      <h1 className="mb-4 text-3xl font-bold pt-10">
        Analytics
      </h1>

      <div className="grid grid-cols-3 gap-5 pb-5">

<div className="border p-4">
        <h2 className="font-semibold">
          Total Clicks
        </h2>

        <p className="text-4xl">
          {analytics.totalClicks}
        </p>
      </div>

      <ClicksOverTimeChart clicks={analytics.clicks} />

      <div className=" border p-4">
        <h2 className="mb-4 font-semibold">
          Recent Clicks
        </h2>

        <table className="w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Device</th>
              <th>Referrer</th>
              <th>Country</th>
            </tr>
          </thead>

          <tbody>
            {analytics.clicks.map((click) => (
              <tr key={click._id}>
                <td>
                  {new Date(
                    click.timestamp
                  ).toLocaleString()}
                </td>

                <td>{click.device}</td>

                <td>{click.referrer}</td>

                <td>{click.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      

      
      </div>

      <div className="grid grid-cols-2 gap-5">
<DeviceBreakdownChart
        clicks={analytics.clicks}
      />

      <ReferrerChart clicks={analytics.clicks} />

      </div>
      
      <Footer />
    </div>

  );
}