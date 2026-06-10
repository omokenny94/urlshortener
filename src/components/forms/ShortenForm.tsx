import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from "../../../convex/_generated/api";
import { useQuery } from 'convex/react';
import { useDebounce } from 'use-debounce';
import QRCodeDisplay from '../qr/QRCodeDisplay';
import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";




export default function ShortenForm() {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');
    const [shortUrl, setShortUrl] = useState("")
    const [debouncedSlug] = useDebounce(slug, 500);
    const [expiryDate, setExpiryDate] = useState("");
    const [error, setError] = useState("");
    

    const createShortLink = useMutation(api.links.createShortLink);

    const slugStatus = useQuery(api.links.checkSlugAvailability, debouncedSlug ? { slug: debouncedSlug } : "skip");


    const isDisabled = 
    !!(slug && slugStatus && !slugStatus.available);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
  setError("");

  const result = await createShortLink({
    originalUrl: url,
    customSlug: slug || undefined,
    expiresAt: expiryDate
      ? new Date(expiryDate).getTime()
      : undefined,
  });

  setShortUrl(
    `${window.location.origin}/${result.shortSlug}`
  );
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Something went wrong"
  );
}
    };

    return (
        <>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="url"
                    placeholder="Enter your URL here"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full border p-5 text-black border-2 bg-neutral-100">

                </input>

                <input
                    type="text"
                    placeholder="Custom slug (optional)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full border p-5 text-black border-2 bg-neutral-100">
                </input>

                <input
  type="datetime-local"
  value={expiryDate}
  onChange={(e) => setExpiryDate(e.target.value)}
  className="w-full border p-5 text-black border-2 bg-neutral-100"
/>

{error && (
  <p className="text-red-500">
    {error}
  </p>
)}


                <SignedIn>
                <button
                    type="submit"
                    className="w-full bg-black py-5 text-white"
                    disabled={isDisabled}
                >Shorten URL</button>

                </SignedIn>

                <SignedOut>
                    <SignInButton mode="modal">
              <button className="w-full bg-black py-5 text-white">
              Shorten URL
              </button>
            </SignInButton>
                </SignedOut>
            </form>

            {slug && slugStatus && (
                <p
                    className={
                        slugStatus.available ? "text-green-500" : "text-red-500"
                    }
                >
                    {slugStatus.message}
                </p>
            )}


            {shortUrl && (
                <div className="mt-6 rounded-lg bg-green-100 p-4">
                    <h3 className="font-semibold text-green-800">
                        Link created successfully!</h3>

                    <a href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline">
                        {shortUrl}
                    </a>
                </div>
            )
            }

            {shortUrl && <QRCodeDisplay value={shortUrl} />}
        </>
    );
}