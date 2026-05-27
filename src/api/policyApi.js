/**
 * policyApi.js
 * All Policy CRUD + search calls to the Spring Boot backend.
 * Import this anywhere in React instead of using mockData.
 */
import api from './axios'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format dollar amounts from raw number → "$1,234.56" */
export const formatCurrency = (val) =>
  val != null ? `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''

/** Enrich a raw Policy object from the backend with display-friendly fields */
export const enrichPolicy = (p) => ({
  ...p,
  annualPremiumStr:  formatCurrency(p.annualPremium),
  writtenPremiumStr: formatCurrency(p.writtenPremium),
  billedPremiumStr:  formatCurrency(p.billedPremium),
})

// ── API Calls ─────────────────────────────────────────────────────────────────

/** GET /api/policies — optionally filter by ?status=&lob=&q= */
export const fetchPolicies = async (params = {}) => {
  const { data } = await api.get('/policies', { params })
  return data.map(enrichPolicy)
}

/** GET /api/policies/:id */
export const fetchPolicy = async (id) => {
  const { data } = await api.get(`/policies/${id}`)
  return enrichPolicy(data)
}

/** POST /api/policies */
export const createPolicy = async (policy) => {
  const { data } = await api.post('/policies', policy)
  return enrichPolicy(data)
}

/** PUT /api/policies/:id */
export const updatePolicy = async (id, policy) => {
  const { data } = await api.put(`/policies/${id}`, policy)
  return enrichPolicy(data)
}

/** DELETE /api/policies/:id */
export const deletePolicy = async (id) => {
  await api.delete(`/policies/${id}`)
}

/** GET /api/policies/stats */
export const fetchPolicyStats = async () => {
  const { data } = await api.get('/policies/stats')
  return data
}

/** Search policies by name or policy number */
export const searchPolicies = async (q) => {
  return fetchPolicies({ q })
}
