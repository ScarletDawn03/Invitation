export function useItineraryAssets() {
  const base = useRuntimeConfig().app.baseURL
  const asset = (path: string) => `${base}${path.replace(/^\//, '')}`
  return { asset }
}
