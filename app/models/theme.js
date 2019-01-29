import Model from 'models/model'
import { API_URL } from 'constants/environment'

class Theme extends Model {
  url() {
    return `/grimoire/${this.id()}`
  }

  image(type = 'full') {
    let url = API_URL + '/'

    url += (type == 'full') ? this.attrs.full_picture_url : this.attrs.mini_picture_url

    return url
  }
}

Theme._id    = 'real_id'
Theme._slug  = 'themes'
Theme.fields = [
  'id',
  'real_id',
  'name',
  'full_picture_url',
  'mini_picture_url'
]

export default Theme
