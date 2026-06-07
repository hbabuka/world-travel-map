// TODO: controlled form for trip fields (title, dates, notes, photos)
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function TripForm({ initialValues, onSubmit, onCancel, loading }) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <Input placeholder="Trip title" name="title" defaultValue={initialValues?.title} required />
      <div className="flex gap-2">
        <Input type="date" name="start_date" defaultValue={initialValues?.start_date} />
        <Input type="date" name="end_date" defaultValue={initialValues?.end_date} />
      </div>
      <Textarea placeholder="Notes…" name="notes" defaultValue={initialValues?.notes} rows={3} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save trip'}</Button>
      </div>
    </form>
  )
}
