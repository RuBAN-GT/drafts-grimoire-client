import Card from 'models/card'

class Search extends Card {}

Search._slug  = 'search'
Search.fields = [
  'id',
  'real_id',
  'name',
  'mini_picture_url',
  'collection_id',
  'collection_real_id',
  'collection_name',
  'theme_id',
  'theme_real_id',
  'theme_name'
]
Search.parents = {}

export default Search
