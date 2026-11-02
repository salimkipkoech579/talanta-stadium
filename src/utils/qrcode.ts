import QRCode from 'qrcode';

export async function generateQrCodeDataUrl(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 320,
      margin: 1,
      color: {
        dark: '#060908',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

export function formatKes(amount: number): string {
  return `KES ${Number(amount).toLocaleString('en-KE')}`;
}
