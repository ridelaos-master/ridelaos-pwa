import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { tid, pgToken, bookingId } = req.body as {
    tid?: string
    pgToken?: string
    bookingId?: string
  }

  const params = new URLSearchParams({
    cid: 'TC0ONETIME',
    tid: tid ?? '',
    partner_order_id: bookingId ?? '',
    partner_user_id: 'ridelaos_user',
    pg_token: pgToken ?? '',
  })

  const response = await fetch(
    'https://open-api.kakaopay.com/online/v1/payment/approve',
    {
      method: 'POST',
      headers: {
        Authorization: `SECRET_KEY ${process.env.KAKAO_PAY_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    }
  )

  const data = (await response.json()) as Record<string, unknown>

  if (!response.ok) {
    return res.status(400).json({ error: data })
  }

  return res.status(200).json(data)
}
