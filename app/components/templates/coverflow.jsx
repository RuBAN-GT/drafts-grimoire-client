import React from 'react'
import PropTypes from 'prop-types'
import { findIndex, isEqual } from 'lodash'
import Swiper from 'swiper'

class Coverflow extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange     = this.handleChange.bind(this)
    this.calculateInitial = this.calculateInitial.bind(this)

    this.swiper = null
    this.state  = { current: this.calculateInitial() }
  }

  calculateInitial() {
    let startFrom = null
    if (this.props.startFrom) {
      startFrom = findIndex(this.props.items, o => {
        return o.id == this.props.startFrom
      })
    }
    if (startFrom == null || startFrom == -1) {
      startFrom = Math.round(this.props.items.length / 2)
    }

    return startFrom
  }

  handleChange(swiper) {
    this.setState({ current: swiper.clickedIndex })

    if (this.props.onChange && swiper.activeIndex !== undefined) {
      this.props.onChange(
        swiper.slides[swiper.activeIndex].dataset.id,
        swiper,
        this
      )
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props.items, nextProps.items) ||
      (
        this.props.startFrom != nextProps.startFrom &&
        nextProps.startFrom == null
      )
    )
  }

  componentDidMount() {
    this.swiper = new Swiper(this.refs.container, {
      initialSlide: this.state.current,
      slidesPerView: 'auto',
      slideToClickedSlide: true,
      centeredSlides: true,
      grabCursor: true,
      threshold: 25,
      effect: 'coverflow',
      coverflow: {
        rotate: 0,
        stretch: 0,
        depth: 280,
        modifier: 1,
        slideShadows : true
      },
      breakpoints: {
        767: {
          effect: 'slide',
          spaceBetween: 10
        },
        991: {
          effect: 'slide',
          spaceBetween: 20
        }
      }
    })

    const self = this

    this.swiper.on('transitionEnd', this.handleChange)
    this.swiper.on('click', swiper => {
      if (swiper.clickedIndex == this.state.current) {
        self.handleChange(swiper)
      }
    })
  }

  componentDidUpdate() {
    const self = this
    this.setState({ current: this.calculateInitial() }, () => {
      self.swiper.update(true)
      self.swiper.slideTo(this.state.current, undefined, false)
    })
  }

  componentWillUnmount() {
    this.swiper = null
  }

  render() {
    return (
      <div className="coverflow component">
        <div ref="container" className="swiper-container">
          <div className="swiper-wrapper">
            {this.props.items.map(item => {
              return (
                <div
                  data-id={item.id}
                  key={item.id}
                  className="swiper-slide"
                  style={{
                    backgroundImage: `url(${item.image})`
                  }}
                >
                  <div className="title" dangerouslySetInnerHTML={{__html: item.title}} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

Coverflow.defaultProps = {
  items: [],
  startFrom: null,
  onChange: null
}
Coverflow.propTypes = {
  items: PropTypes.array.isRequired,
  startFrom: PropTypes.string,
  onChange: PropTypes.func
}

export default Coverflow
