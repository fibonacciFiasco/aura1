/**
 * usePolicies — custom hook for policy list with loading, error, CRUD
 * Usage:
 *   const { policies, loading, error, reload, remove, save } = usePolicies()
 *   const { policies } = usePolicies({ status: 'Active' })
 *   const { policies } = usePolicies({ q: 'search term' })
 */
import { useState, useEffect, useCallback } from 'react'
import { fetchPolicies, createPolicy, updatePolicy, deletePolicy } from '../api/policyApi'

export function usePolicies(params = {}) {
  const [policies, setPolicies]     = useState([])
  const [loading,  setLoading]      = useState(true)
  const [error,    setError]        = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchPolicies(params)
      .then(setPolicies)
      .catch(e => setError(e.message || 'Failed to load policies'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)])

  useEffect(() => { load() }, [load])

  const save = async (policy) => {
    const saved = policy.id
      ? await updatePolicy(policy.id, policy)
      : await createPolicy(policy)
    setPolicies(prev =>
      policy.id ? prev.map(p => p.id === saved.id ? saved : p) : [...prev, saved]
    )
    return saved
  }

  const remove = async (id) => {
    await deletePolicy(id)
    setPolicies(prev => prev.filter(p => p.id !== id))
  }

  return { policies, loading, error, reload: load, save, remove }
}

export default usePolicies
