import React from 'react'
import EventModel from 'models/event'

export default class Events extends React.Component {
  constructor(props) {
    super(props)

    this.state = { events: [] }
  }

  componentDidMount() {
    EventModel.collection({ per: 4 }).then(data => {
      this.setState({
        events: data
      })
    })
  }

  render() {
    return (
      <div className="events basic wrapper component">
        <div className="ui equal width grid">
          {this.state.events.map(item => {
            return <div key={item.attrs.id} className="column">
              <div className="event">
                <p>{item.attrs.text}</p>
                <div className="date">
                  <a href={item.attrs.url} target="_blank">{item.attrs.created_at}</a>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    )
  }
}
