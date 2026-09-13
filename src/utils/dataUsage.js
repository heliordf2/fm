// Decimal units: kbps = 1,000 bits/second; MB = 1,000,000 bytes.
export function estimateDataUsage(bitrate, hours, days = 1) {
  const values = [bitrate, hours, days]
  if (values.some((value) => !Number.isFinite(value) || value < 0)) return null
  const megabytes = bitrate * hours * days * 0.45
  return Number.isFinite(megabytes) ? megabytes : null
}
