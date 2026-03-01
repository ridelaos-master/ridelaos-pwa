import fs from 'fs'
import os from 'os'
import path from 'path'

// CLI 토큰 읽기
const tokenPath = path.join(os.homedir(), 'AppData', 'Roaming', 'supabase', 'access-token')
const token = fs.readFileSync(tokenPath, 'utf8').trim()
console.log('토큰 확인:', token.substring(0, 20) + '...')

const sql = `
INSERT INTO tour_dates (course_id, departure_date, available_seats, current_pax, status) VALUES
('00000000-0000-0000-0000-000000000100','2026-03-15',8,2,'open'),
('00000000-0000-0000-0000-000000000100','2026-04-05',8,0,'open'),
('00000000-0000-0000-0000-000000000101','2026-03-20',6,1,'open'),
('00000000-0000-0000-0000-000000000101','2026-04-10',6,0,'open'),
('00000000-0000-0000-0000-000000000102','2026-03-25',8,3,'open'),
('00000000-0000-0000-0000-000000000103','2026-03-08',10,0,'open'),
('00000000-0000-0000-0000-000000000103','2026-03-22',10,4,'open'),
('00000000-0000-0000-0000-000000000104','2026-04-15',6,0,'open'),
('00000000-0000-0000-0000-000000000105','2026-04-20',6,2,'open'),
('00000000-0000-0000-0000-000000000106','2026-05-01',8,0,'open')
`

const res = await fetch('https://api.supabase.com/v1/projects/yljvrlzlxcgmlxmmjgcg/database/query', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: sql })
})

const result = await res.json()
console.log('결과:', JSON.stringify(result, null, 2))
