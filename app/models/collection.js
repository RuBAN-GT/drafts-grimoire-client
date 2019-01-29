import Model from 'models/model'

class Collection extends Model {
  url() {
    return `/grimoire/${this.attrs.theme_real_id}/${this.id()}`
  }
}

Collection._id    = 'real_id'
Collection._slug  = 'collections'
Collection.fields = [
  'id',
  'real_id',
  'name',
  'theme_id',
  'theme_real_id',
  'full_picture_url',
  'mini_picture_url'
]
Collection.parents = { themes: 'theme_real_id' }

export default Collection
