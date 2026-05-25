export default function groupByDay(weekly_hours = []) {
  const map = new Map()
  for (const h of weekly_hours) {
    if (h?.weekday == null) continue
    const arr = map.get(h.weekday) || []
    arr.push({ start: h.start, end: h.end })
    map.set(h.weekday, arr)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([weekday, ranges]) => ({
      weekday,
      ranges: ranges
        .sort((a, b) => a.start.localeCompare(b.start))
        .map(r => `${r.start} à ${r.end}`)
    }))
}