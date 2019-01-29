/**
 * Set page title by template
 *
 * @param {Array} pages
 *
 * @return {String}
 */
export default function (pages = []) {
  let title = pages.shift()

  pages = pages.map(name => name.toUpperCase())
  title = [title, ...pages].join(' //  ')

  document.title = title

  return title
}
