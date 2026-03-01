import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { bookingId, itemName, quantity, totalAmount } = req.body as {
    bookingId?: string
    itemName?: string
    quantity?: number
    totalAmount?: number
  }

  const baseUrl =
    process.env.VITE_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5173')

  const params = new URLSearchParams({
    cid: 'TC0ONETIME',
    partner_order_id: bookingId ?? '',
    partner_user_id: 'ridelaos_user',
    item_name: itemName ?? '라오스 오토바이 투어',
    quantity: String(quantity ?? 1),
    total_amount: String(totalAmount ?? 0),
    tax_free_amount: '0',
    approval_url: `${baseUrl}/payment/success`,
    cancel_url: `${baseUrl}/payment`,
    fail_url: `${baseUrl}/payment`,
  })

  const response = await fetch(
    'https://open-api.kakaopay.com/online/v1/payment/ready',
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
