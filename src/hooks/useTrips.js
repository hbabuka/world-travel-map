import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

export function useTrips(userId) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTrips = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if (error) setError(error.message)
    else setTrips(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  const addTrip = useCallback(async (trip) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`
    const tempTrip = { id: tempId, ...trip, user_id: userId, created_at: new Date().toISOString() }
    setTrips(prev => [...prev, tempTrip])

    const { data, error } = await supabase
      .from('trips')
      .insert({ ...trip, user_id: userId })
      .select()
      .single()
    if (error) {
      setTrips(prev => prev.filter(t => t.id !== tempId))
      console.error('[WTM] addTrip failed', error)
      return null
    }
    setTrips(prev => prev.map(t => t.id === tempId ? data : t))
    return data
  }, [userId])

  const updateTrip = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setTrips(prev => prev.map(t => t.id === id ? data : t))
    return data
  }, [])

  const deleteTrip = useCallback(async (id) => {
    setTrips(prev => prev.filter(t => t.id !== id))
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) {
      console.error('[WTM] deleteTrip failed', error)
      fetchTrips()
    }
  }, [fetchTrips])

  const removeByName = useCallback((countryName) => {
    setTrips(prev => {
      prev
        .filter(t => t.country_name === countryName)
        .forEach(t =>
          supabase.from('trips').delete().eq('id', t.id).then(({ error }) => {
            if (error) console.error('[WTM] removeByName failed', error)
          })
        )
      return prev.filter(t => t.country_name !== countryName)
    })
  }, [])

  const visitedNames = useMemo(() => new Set(trips.map(t => t.country_name)), [trips])

  return {
    trips,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    removeByName,
    visitedNames,
    refetch: fetchTrips,
  }
}
