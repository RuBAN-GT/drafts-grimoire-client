import I18n from 'misc/i18n'

describe('I18n', () => {
  it('tries to detect locale', () => {
    localStorage.setItem('locale', 'ru')

    expect(I18n.detect()).toBe('ru')
  })

  it('tries to translate existed and unavailable words with i18n object', () => {
    const i18n = new I18n({
      locale: 'ru',
      locales: ['ru', 'en'],
      translations: {
        'ru': {
          'hello': 'russian hello'
        },
        'en': {
          'hello': 'english hello'
        }
      }
    })

    expect(i18n.t('hello')).toBe('russian hello')
    expect(i18n.t('unknown')).toBe('unknown')
  })
})
