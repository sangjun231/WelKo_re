import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const width = searchParams.get('w') || '800';
  const height = searchParams.get('h') || '600';
  const center = searchParams.get('center'); //x좌표, y좌표
  const level = searchParams.get('level') || '10';
  const mapType = searchParams.get('maptype') || 'basic';
  const format = searchParams.get('format') || 'png';

  if (!center) {
    return NextResponse.json({ error: 'Center coordinates are required' }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID!;
  const clientSecret = process.env.NEXT_PUBLIC_NCP_CLIENT_SECRET!;
  const url = `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=${width}&h=${height}&center=${center}&level=${level}&maptype=${mapType}&format=${format}&lang=en`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId as string,
        'X-NCP-APIGW-API-KEY': clientSecret as string
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message }, { status: response.status });
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': `image/${format}`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
