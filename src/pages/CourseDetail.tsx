import { useParams } from 'react-router-dom'

export function CourseDetail() {
  const { id } = useParams()
  return <p className="text-rl-green-mid">코스 상세 준비 중... (id: {id})</p>
}
