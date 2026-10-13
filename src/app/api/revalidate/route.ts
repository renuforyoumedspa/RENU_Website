import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// Called by a Sanity webhook whenever a document is published, updated or
// deleted. Refreshes every page from Sanity right away, so the hourly
// fallback in layout.tsx rarely matters. The content set is small (~90
// pages), so refreshing everything is simpler and safer than working out
// which pages a given edit touches.
//
// Setup (sanity.io/manage → RENU project → API → Webhooks):
//   URL:     https://renuforyou.com/api/revalidate/
//   Trigger: Create, Update, Delete   Dataset: production   HTTP method: POST
//   Secret:  same value as SANITY_REVALIDATE_SECRET in Netlify's env vars
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ message: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 });

  try {
    // Verifies the webhook's signature, and waits briefly so the read
    // that follows sees the just-published content.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });

    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
