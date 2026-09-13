import { getAllRadios, getEditorialProfile, getIndexableStates, getIndexableCitiesWithState } from '../src/data/radioRepository.js'
import { isCityEditorialReady } from '../src/data/cityEditorial.js'
import { LISTENING_DETAILS } from '../src/data/listeningDetails.js'

const radios = getAllRadios()
const withoutProfile = radios.filter((radio) => !getEditorialProfile(radio.id))
const missing = (key) => radios.filter((radio) => !radio[key]).map((radio) => ({ name: radio.name, path: `/${radio.path}` }))
const profileGroups = Map.groupBy(radios.filter((radio) => getEditorialProfile(radio.id)), (radio) => getEditorialProfile(radio.id).profile)
console.log(JSON.stringify({
  totalRadios: radios.length,
  withProfile: radios.length - withoutProfile.length,
  withListeningDetails: Object.keys(LISTENING_DETAILS).length,
  withoutProfile: withoutProfile.map((radio) => ({ name: radio.name, path: `/${radio.path}` })),
  missingOfficialWebsite: missing('websiteUrl'),
  missingLocation: missing('city'),
  missingFrequency: missing('frequency'),
  identicalProfiles: [...profileGroups.values()].filter((group) => group.length > 1).map((group) => group.map((radio) => radio.name)),
  smallStateListings: getIndexableStates().filter((state) => state.radios.length < 3).map((state) => ({ state: state.name, radios: state.radios.length })),
  citiesAwaitingEditorial: getIndexableCitiesWithState().filter((city) => !isCityEditorialReady(city.stateSlug, city.slug)).map((city) => `/${city.stateSlug}/${city.slug}`),
  note: 'Missing frequency may be expected for web-only stations. Missing profiles and city editorials are already excluded from the sitemap; do not invent content to fill gaps.',
}, null, 2))
