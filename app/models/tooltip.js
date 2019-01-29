import Model from 'models/model'

class Tooltip extends Model {
  slugs() {
    return this.attrs.slug.replace(', ', ',').split(',')
  }

  /**
   * Replace string by template
   *
   * @param  {String}  key
   * @param  {String}  replaced template
   * @param  {Boolean} once replaces first key
   * @return {String}
   */
  static replaceByTemplate(string, key, replaced, once = true) {
    if (!string || string.indexOf(key) == -1) { return string }

    const regexp = new RegExp('(^|[\\s\'\"\,\;\>])(' + key  + ')([\\s\)\.\'\"\!\,\;\?\<]|$)', 'g')
    const parts  = string.split(regexp)

    let result = ''
    let flag = true

    parts.forEach((part, i) => {
      if (
        part == key &&
        (once == false || flag) &&
        (
          i < 2 ||
          parts[i-2].indexOf('data-tip') == -1 &&
          parts[i-2].slice(-1) != '=' ||
          parts[i-2].indexOf('data-tip') < parts[i-2].indexOf('</span')
        )
      ) {
        result += replaced

        flag = false

        return
      }
      else {
        result += part
      }
    })

    return result
  }

  /**
   * Full replace
   *
   * @param  {String} content
   * @return {String}
   */
  fullReplace(content) {
    return (this.attrs.replacement && this.attrs.slug.toLowerCase() == content.toLowerCase()) ? this.attrs.body : content
  }

  /**
   * Replace every keyword of string to body content
   *
   * @param  {String} content
   * @return {String}
   */
  replace(content) {
    if (this.attrs.replacement == false) { return content }

    this.slugs().forEach(slug => {
      content = this.constructor.replaceByTemplate(
        content,
        slug,
        this.attrs.body,
        false
      )
    })

    return content
  }

  /**
   * Replace first keyword of string to body content with html
   *
   * @param  {Stirng} content
   * @return {String}
   */
  tooltip(content) {
    if (this.attrs.replacement) { return content }

    this.slugs().some(slug => {
      if (slug == '') { return false }

      const tmp = content

      content = this.constructor.replaceByTemplate(
        content,
        slug,
        `<span class="helped" data-tip="${this.attrs.body}" data-for="card">${slug}</span>`,
        true
      )

      return tmp != content
    })

    return content
  }
}

Tooltip._slug  = 'tooltips'
Tooltip.fields = [
  'id',
  'created_at',
  'slug',
  'body',
  'replacement'
]

export default Tooltip
