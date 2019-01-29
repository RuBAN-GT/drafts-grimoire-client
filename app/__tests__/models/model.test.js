import Model from 'models/model'
import fetchMock from 'fetch-mock'

class SthResource extends Model {}
SthResource._slug  = 'sth-resource'
SthResource.fields = [ 'id', 'name' ]

class NestedResource extends SthResource {}
NestedResource._slug   = 'nested-resource'
NestedResource.parents = { 'sth-resource': 'sth_resource_id' }

const response = {
  success: true,
  data: null,
  errors: []
}

describe('Model static methods', () => {
  afterEach(() => {
    return new Promise(resolve => {
      localStorage.clear()
      fetchMock.restore()
      resolve()
    })
  })

  it('returns model name (slug) in kebab style', () => {
    expect(SthResource.slug()).toBe('sth-resource')
  })

  it('returns url for model with parents', () => {
    expect(NestedResource.buildUrl('', { sth_resource_id: 1 }))
      .toBe('sth-resource/1/nested-resource/')
  })

  it('returns model collection', () => {
    expect.hasAssertions()

    fetchMock.getOnce('end:/sth-resource/', Object.assign(
      {}, 
      response,
      { data: [{ id: 1 }, { id: 2 }] }
    ))

    return SthResource.all().then(result => expect(result).toHaveLength(2))
  })

  it('returns model record by id', () => {
    expect.hasAssertions()

    fetchMock.getOnce('end:/sth-resource/1', Object.assign(
      {}, 
      response,
      { data: { id: 1 } }
    ))

    return SthResource.find(1).then(result => expect(result.id()).toBe(1))
  })
})

describe('Model instances', () => {
  afterEach(() => {
    return new Promise(resolve => {
      localStorage.clear()
      fetchMock.restore()
      resolve()
    })
  })

  it('initializes record with attributes', () => {
    const attrs  = { id: 1 }
    const record = new SthResource(attrs)

    expect(record.id()).toEqual(attrs.id)
  })

  it('creates new record and returns new instance', () => {
    expect.hasAssertions()

    const attrs  = { name: 'hello' }
    const record = new SthResource(attrs)

    fetchMock.postOnce('end:/sth-resource/', Object.assign(
      {}, 
      response,
      { data: Object.assign(attrs, { id: 1 }) }
    ))

    return record.save().then(record => expect(record.persisted).toBeTruthy())
  })

  it('creates wrong record with errors', () => {
    expect.hasAssertions()

    const attrs  = { name: 'hello' }
    const record = new SthResource(attrs)

    fetchMock.postOnce('end:sth-resource/', Object.assign(
      {}, 
      response,
      { 
        success: false,
        data: Object.assign(attrs, { id: 1 }),
        errors: ['all is bad!']
      }
    ))

    return record.save().then(record => expect(record.persisted).toBeFalsy() )
  })

  it('updates persisted record with save method', () => {
    expect.hasAssertions()

    fetchMock.getOnce('end:sth-resource/1', Object.assign(
      {}, 
      response,
      { data: { id: 1 } }
    ))
    fetchMock.putOnce('end:sth-resource/1', Object.assign(
      {}, 
      response,
      { data: { id: 1, name: 'hello' } }
    ))

    return SthResource.find(1).then(record => {
      record.name = 'hello'

      return record.save().then(record => {
        expect(record.errors).toHaveLength(0)
      })
    })
  })

  it('destroes persisted record', () => {
    expect.hasAssertions()

    fetchMock.getOnce('end:sth-resource/1', Object.assign(
      {}, 
      response,
      { data: { id: 1 } }
    ))
    fetchMock.deleteOnce('end:sth-resource/1', Object.assign(
      {}, 
      response,
      { data: { id: 1 } }
    ))

    return SthResource.find(1).then(record => record.destroy()).then(record => {
      expect(record.persisted).toBeFalsy()
    })
  })
})
