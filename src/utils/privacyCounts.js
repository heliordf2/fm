export function reportPrivacyChoice(choice) {
  if (typeof window === 'undefined') return
  // No analytics session, referrer, URL, radio, device or persistent identifier.
  void fetch('/api/privacy-choice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choice }),
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    keepalive: true,
  }).catch(() => {})
}
