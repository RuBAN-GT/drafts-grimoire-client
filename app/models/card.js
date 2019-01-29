import Model from 'models/model'
import ApiClient from 'misc/api-client'
import { API_URL } from 'constants/environment'

class Card extends Model {
  url() {
    return `/grimoire/${this.attrs.theme_real_id}/${this.attrs.collection_real_id}/${this.id()}`
  }

  image(type = 'full') {
    let url = API_URL + '/'

    url += (type == 'full') ? this.attrs.full_picture_url : this.attrs.mini_picture_url

    return url
  }

  read() {
    return ApiClient.post(this.constructor.buildUrl(this.id() + '/read', this.attrs))
  }
  unread() {
    return ApiClient.del(this.constructor.buildUrl(this.id() + '/unread', this.attrs))
  }

  /**
   * Get full text for card
   *
   * @return {String} with intro and description
   */
  fullContent() {
    let content = ''

    if (!!this.attrs.intro) {
      content += '<div class="intro">' + this.attrs.intro + '</div>'
    }
    if (!!this.attrs.description) {
      content += '<div class="description">' + this.attrs.description + '</div>'
    }

    return content
  }
}

Card._id    = 'real_id'
Card._slug  = 'cards'
Card.fields = [
  'id',
  'real_id',
  'name',
  'intro',
  'description',
  'theme_real_id',
  'full_picture_url',
  'mini_picture_url',
  'collection_id',
  'collection_real_id',
  'theme_id',
  'theme_real_id',
  'glossary',
  'replacement'
]
Card.parents = {
  themes: 'theme_real_id',
  collections: 'collection_real_id'
}

export default Card
