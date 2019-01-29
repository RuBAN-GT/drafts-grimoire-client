import Tooltip from 'models/tooltip'

describe('Tooltip replacement and helped methods', () => {
  it('returns replaced string', () => {
    const tooltip = new Tooltip({
      slug: 'keyword',
      body: 'replacement',
      replacement: true
    })

    expect(tooltip.replace('text with keyword')).toBe('text with replacement')
    expect(tooltip.replace('text with keyword.')).toBe('text with replacement.')
    expect(tooltip.replace('text with "keyword".')).toBe('text with "replacement".')
    expect(tooltip.replace('html with <span>keyword</span>.')).toBe('html with <span>replacement</span>.')
    expect(tooltip.replace('html with <span sth="keyword">bad</span>.')).toBe('html with <span sth="keyword">bad</span>.')
    expect(tooltip.replace('keyword from text')).toBe('replacement from text')
    expect(tooltip.replace('keywords from text')).toBe('keywords from text')
  })

  it('returns replaced string for cyrillic text', () => {
    const tooltip = new Tooltip({
      slug: 'ключ',
      body: 'замена',
      replacement: true
    })

    expect(tooltip.replace('текст с ключ')).toBe('текст с замена')
    expect(tooltip.replace('текст с ключом')).toBe('текст с ключом')
  })

  it('returns tooltip for text', () => {
    const tooltip = new Tooltip({
      slug: 'keyword',
      body: 'tip',
      replacement: false
    })

    expect(tooltip.tooltip('text with keyword')).toBe('text with <span class="helped" data-tip="tip" data-for="card">keyword</span>')
    expect(tooltip.tooltip('text with keyword.')).toBe('text with <span class="helped" data-tip="tip" data-for="card">keyword</span>.')
    expect(tooltip.tooltip('text with "keyword".')).toBe('text with "<span class="helped" data-tip="tip" data-for="card">keyword</span>".')
    expect(tooltip.tooltip('html with <b>keyword</b>')).toBe('html with <b><span class="helped" data-tip="tip" data-for="card">keyword</span></b>')
    expect(tooltip.tooltip('html with <b>keyword</b>.')).toBe('html with <b><span class="helped" data-tip="tip" data-for="card">keyword</span></b>.')
    expect(tooltip.tooltip('html with <span data-tip="keyword">bad</span>.')).toBe('html with <span data-tip="keyword">bad</span>.')
  })

  it('returns tooltip for cyrillic', () => {
    const tooltip = new Tooltip({
      slug: 'ключ,ключом',
      body: 'tip',
      replacement: false
    })

    expect(tooltip.tooltip('текст с ключ')).toBe('текст с <span class="helped" data-tip="tip" data-for="card">ключ</span>')
    expect(tooltip.tooltip('текст с ключом')).toBe('текст с <span class="helped" data-tip="tip" data-for="card">ключом</span>')
  })


  it('returns tooltip only once', () => {
    const tooltip = new Tooltip({
      slug: 'world',
      body: 'tip',
      replacement: false
    })

    let tmp = tooltip.tooltip('hello world')

    expect(tmp).toBe('hello <span class="helped" data-tip="tip" data-for="card">world</span>')
    expect(tooltip.tooltip(tmp)).toBe('hello <span class="helped" data-tip="tip" data-for="card">world</span>')
  })

  it('returns tooltip only once for sentence', () => {
    const long_tooltip = new Tooltip({
      slug: 'hello world',
      body: 'привет мир',
      replacement: false
    })
    const part_tooltip = new Tooltip({
      slug: 'world',
      body: 'test',
      replacement: false
    })
    let etalon = 'Sentence with <span class="helped" data-tip="привет мир" data-for="card">hello world</span>'
    let tmp    = long_tooltip.tooltip('Sentence with hello world')

    expect(tmp).toBe(etalon)
    expect(part_tooltip.tooltip(tmp)).toBe(etalon)

    etalon += ' trash'
    expect(part_tooltip.tooltip(etalon)).toBe(etalon)
  })

  it('returns content with tooltip for text with existed tooltip', () => {
    const tooltip = new Tooltip({
      slug: 'keyword',
      body: 'body',
      replacement: false
    })

    const etalon = 'Sentence with <span class="helped" data-tip="comment" data-for="card">hello world</span> and keyword'

    expect(tooltip.tooltip(etalon)).toBe('Sentence with <span class="helped" data-tip="comment" data-for="card">hello world</span> and <span class="helped" data-tip="body" data-for="card">keyword</span>')
  })

  it('returns content for real text', () => {
    const original = '<div class="intro"><p><strong>&laquo;Тебе здесь на рады&raquo; &mdash;Неизвестный</strong></p><p><strong>&laquo;Позволю себе не согласиться&raquo; &mdash; Широ-4</strong></p></div><div class="description"><p>Нарушитель &mdash; персональный пистолет Широ-4, собранный за бесчисленные циклы, которые Широ-4 провел, исследуя дикие земли за пределами Города. Этот легкий, скорострельный малый закончил куда больше разговоров, чем начал. И завершит еще больше, прежде чем закончится последняя война.</p></div>'

    const tooltip = new Tooltip({
      slug: 'Широ-4',
      body: 'Shiro-4',
      replacement: false
    })

    expect(tooltip.tooltip(original)).toBe('<div class="intro"><p><strong>&laquo;Тебе здесь на рады&raquo; &mdash;Неизвестный</strong></p><p><strong>&laquo;Позволю себе не согласиться&raquo; &mdash; <span class="helped" data-tip="Shiro-4" data-for="card">Широ-4</span></strong></p></div><div class="description"><p>Нарушитель &mdash; персональный пистолет Широ-4, собранный за бесчисленные циклы, которые Широ-4 провел, исследуя дикие земли за пределами Города. Этот легкий, скорострельный малый закончил куда больше разговоров, чем начал. И завершит еще больше, прежде чем закончится последняя война.</p></div>')
  })
})
