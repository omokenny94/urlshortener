import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { UAParser } from "ua-parser-js";
import { api } from "../../convex/_generated/api";

export default function Redirect() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const hasTracked = useRef(false);

  const link = useQuery(
    api.links.getLinkBySlug,
    slug ? { slug } : "skip"
  );

  const trackClick = useMutation(api.links.trackClick);

  useEffect(() => {
    const run = async () => {
      if (!link?.originalUrl || !slug) return;

      if (hasTracked.current) return;
      hasTracked.current = true;

      const isExpired =
        link.expiresAt && Date.now() > link.expiresAt;

      if (isExpired) {
        navigate("/expired");
        return;
      }

      const parser = new UAParser();
      const device = parser.getDevice().type ?? "desktop";

      await trackClick({
        slug,
        referrer: document.referrer || "Direct",
        device,
        country: "Unknown",
      });

      window.location.href = link.originalUrl;
    };

    run();
  }, [link?.originalUrl, link?.expiresAt, slug, trackClick, navigate]);

  if (link === undefined) {
    return <p>Loading...</p>;
  }

  if (!link) {
    return <p>Link not found.</p>;
  }

  return <p>Redirecting...</p>;
}