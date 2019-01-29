import ApiClient from 'misc/api-client'
import fetchMock from 'fetch-mock'

describe('ApiClient', () => {
  const content = { grimoire: 1 }

  beforeEach(() => fetchMock.restore())

  it('returns json for request', () => {
    expect.hasAssertions()

    fetchMock.get('*', content);
    return ApiClient.request('/')
      .then(response => response.json())
      .then(data => expect(data).toEqual(content))
  })

  it('returns json for get', () => {
    expect.hasAssertions()

    fetchMock.get('*', content);
    return ApiClient.get('/').then(data => expect(data).toEqual(content))
  })

  it('checks authed headers in api request headers', () => {
    expect.hasAssertions()

    localStorage.setItem('token', 'some.jwt.hash')

    fetchMock.get((url, opts) => {
      return opts.headers['Authorization'] != null
    }, content)
    fetchMock.get('*', {error: 'fail'})

    return ApiClient.get('/').then(data => expect(data).toEqual(content))
  })
})
