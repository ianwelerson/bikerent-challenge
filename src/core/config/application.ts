const { VITE_API_CANDIDATE_TOKEN, VITE_API_USER_ID, VITE_API_URL, BASE_URL: VITE_BASE_URL = '' } = import.meta.env || {}

const BASE_URL = VITE_BASE_URL || '/'
const API_URL = VITE_API_URL || ''
const API_CANDIDATE_TOKEN = VITE_API_CANDIDATE_TOKEN || ''
const API_USER_ID = Number(VITE_API_USER_ID) // TODO: Remove after login screen creation

const PRICING_SERVICE_FEE = 0.15 // percentual asfractions

export { API_CANDIDATE_TOKEN, API_USER_ID, API_URL, BASE_URL, PRICING_SERVICE_FEE }
