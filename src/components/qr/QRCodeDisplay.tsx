import {QRCodeSVG} from 'qrcode.react';
import {useRef, useState} from 'react';

type QRCodeDisplayProps = {
    value: string;
};

export default function QRCodeDisplay({ value }: QRCodeDisplayProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');

    const downloadSVG = () => {
        const svg = qrRef.current?.querySelector('svg');

        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'qr-code.svg';
        link.click();

        URL.revokeObjectURL(url);
    };

    const downloadPNG = () => {
        const svg = qrRef.current?.querySelector('svg');

        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = 500;
            canvas.height = 500;

            if (ctx) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, 500, 500);
            }

            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');

            link.href = pngUrl;
            link.download = 'qr-code.png';
            link.click();

            URL.revokeObjectURL(url);
        };

        img.src = url;
    };

    return (
        <div className="mt-6 rounded-xl bg-white p-6 text-black">
            <h3 className="mb-4 text-lg font-semibold">QR Code</h3>

            <div ref={qrRef} className="inline-block rounded-lg bg-white p-4">
                <QRCodeSVG value={value} fgColor={fgColor} bgColor={bgColor} size={220} level="H" />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label>
                    Foreground
                    <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="mt-1 block h-10 w-full"
                    />
                </label>

                <label>
                    Background
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="mt-1 block h-10 w-full"
                    />
                </label>
            </div>

            <button
                onClick={downloadSVG}
                className="bg-black text-white p-3"
            >
                Download SVG
            </button>

            <button
                onClick={downloadPNG}
                className="ml-4 bg-white p-3 text-black border-2 border-black"
            >
                Download PNG
            </button>
        </div>
    )
}
