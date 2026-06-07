import { useState, useEffect, useCallback } from 'react'
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
      .order('start_date', { ascending: false })
    if (error) setError(error.message)
    else setTrips(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  const addTrip = async (trip) => {
    const { data, error } = await supabase.from('trips').insert({ ...trip, user_id: userId }).select().single()
    if (error) throw error
    setTrips((prev) => [data, ...prev])
    return data
  }

  const updateTrip = async (id, updates) => {
    const { data, error } = await supabase.from('trips').update(updates).eq('id', id).select().single()
    if (error) throw error
    setTrips((prev) => prev.map((t) => (t.id === id ? data : t)))
    return data
  }

  const deleteTrip = async (id) => {
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) throw error
    setTrips((prev) => prev.filter((t) => t.id !== id))
  }

  const visitedCountryCodes = [...new Set(trips.map((t) => t.country_code))]

  return { trips, loading, error, addTrip, updateTrip, deleteTrip, visitedCountryCodes, refetch: fetchTrips }
}
