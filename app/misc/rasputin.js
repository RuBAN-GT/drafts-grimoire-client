import Cache from 'misc/cache'

export default class Rasputin {
  constructor() {
    this.developer = 'dkruban@gmail.com'

    this.parents = [
      'olifirka',
      'RuBAN-GT',
      'darico3000',
      'RGlitch',
      'Destiny.wtf team'
    ]
  }

  /**
   * Clear cache from models
   */
  clearCache() {
    Cache.removeAll()

    console.info('All cache was clean...')
  }

  /**
   * For advert
   *
   * @return {String}
   */
  showDeveloper() {
    console.info(this.developer)

    return this.developer
  }

  /**
   * Parents list
   *
   * @return {Array}
   */
  showParents() {
    console.info('Who did create me? It is easy:')

    this.parents.forEach(parent => console.info('* ' + parent))

    return this.parents
  }
}
