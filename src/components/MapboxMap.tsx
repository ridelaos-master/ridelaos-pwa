import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { supabase } from '../lib/supabase'

interface Waypoint {
  id: string
  course_id: string
  name_ko: string | null
  lat: number
  lng: number
  type: 'start' | 'waypoint' | 'end' | 'rest'
}

const MARKER_COLOR: Record<Waypoint['type'], string> = {
  start: '#22c55e',
  end: '#ef4444',
  waypoint: '#3b82f6',
  rest: '#6b7280',
}

const TYPE_LABEL: Record<Waypoint['type'], string> = {
  start: '출발지',
  waypoint: '경유지',
  end: '도착지',
  rest: '휴식지',
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function fetchWaypoints(courseId: string): Promise<Waypoint[]> {
  const { data, error } = await supabase
    .from('course_waypoints')
    .select('*')
    .eq('course_id', courseId)
    .order('id')

  if (error) throw error
  return (data ?? []) as Waypoint[]
}

interface MapboxMapProps {
  courseId: string
  className?: string
}

export function MapboxMap({ courseId, className }: MapboxMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token || !mapRef.current || !courseId) {
      if (!token) setError(true)
      setLoading(false)
      return
    }

    let cancelled = false
    const container = mapRef.current

    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      accessToken: token,
      center: [102.6331, 17.9757], // 라오스 비엔티안
      zoom: 6,
    })

    mapInstanceRef.current = map

    map.on('load', () => {
      if (cancelled) return

      fetchWaypoints(courseId)
        .then((waypoints) => {
          if (cancelled) return

          const coords: [number, number][] = waypoints.map((w) => [w.lng, w.lat])

          if (coords.length >= 2) {
            if (map.getSource('route')) {
              map.removeLayer('route')
              map.removeSource('route')
            }
            map.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature' as const,
                properties: {},
                geometry: {
                  type: 'LineString' as const,
                  coordinates: coords,
                },
              },
            })
            map.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              paint: {
                'line-color': '#F4A261',
                'line-width': 4,
              },
            })
          }

          markersRef.current.forEach((m) => m.remove())
          markersRef.current = []

          waypoints.forEach((wp) => {
            const color = MARKER_COLOR[wp.type] ?? MARKER_COLOR.waypoint
            const typeLabel = TYPE_LABEL[wp.type] ?? '경유지'
            const name = wp.name_ko ?? ''

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<strong>${escapeHtml(name)}</strong><br/>${escapeHtml(typeLabel)}`
            )

            const marker = new mapboxgl.Marker({ color })
              .setLngLat([wp.lng, wp.lat])
              .setPopup(popup)
              .addTo(map)

            markersRef.current.push(marker)
          })

          if (waypoints.length >= 2) {
            const lngs = waypoints.map((w) => w.lng)
            const lats = waypoints.map((w) => w.lat)
            const minLng = Math.min(...lngs)
            const maxLng = Math.max(...lngs)
            const minLat = Math.min(...lats)
            const maxLat = Math.max(...lats)
            map.fitBounds(
              [
                [minLng, minLat],
                [maxLng, maxLat],
              ],
              { padding: 40 }
            )
          }

          setLoading(false)
        })
        .catch(() => {
          if (!cancelled) {
            setError(true)
            setLoading(false)
          }
        })
    })

    map.on('error', () => {
      if (!cancelled) {
        setError(true)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [courseId])

  if (error) {
    return (
      <div
        className={className}
        style={{ minHeight: 256 }}
      >
        <div className="flex h-full min-h-[256px] items-center justify-center rounded-card bg-gray-100 p-4">
          <p className="text-sm text-gray-600">지도를 불러오지 못했습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className ?? ''}`} style={{ minHeight: 256 }}>
      {loading && (
        <div
          className="absolute inset-0 z-10 rounded-card bg-gray-200 animate-pulse"
          aria-hidden
        />
      )}
      <div
        ref={mapRef}
        className="h-full w-full rounded-card overflow-hidden"
        style={{ height: '100%', minHeight: 256 }}
      />
    </div>
  )
}
