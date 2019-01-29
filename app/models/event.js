import Model from 'models/model'

class Event extends Model {}

Event._slug  = 'events'
Event.fields = [
  'id',
  'created_at',
  'text',
  'url'
]

export default Event
