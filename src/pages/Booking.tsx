import { useParams } from 'react-router-dom'

export function Booking() {
  const { dateId } = useParams()
  return <p className="text-rl-green-mid">예약 화면 준비 중... (dateId: {dateId})</p>
}
