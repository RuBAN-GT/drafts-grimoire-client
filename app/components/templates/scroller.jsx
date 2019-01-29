import React from 'react'
import PropTypes from 'prop-types'
import Swiper from 'swiper'
import { isEqual } from 'lodash'

class Scroller extends React.Component {
  constructor(props) {
    super(props)

    this.swiper = null
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.children, nextProps.children)
  }

  componentDidMount() {
    this.swiper = new Swiper(this.refs.container, {
      scrollbar: this.refs.scrollbar,
      scrollbarHide: false,
      scrollbarDraggable: true,
      direction: 'vertical',
      slidesPerView: 'auto',
      mousewheelControl: true,
      threshold: 25,
      freeMode: true,
      simulateTouch: false
    })

    if (this.props.onReachBeginning) {
      this.swiper.on('reachBeginning', swiper => this.props.onReachBeginning(swiper))
    }
    if (this.props.onReachEnd) {
      this.swiper.on('reachEnd', swiper => this.props.onReachEnd(swiper))
    }
  }

  componentDidUpdate() {
    this.swiper.update(true)

    if (this.props.refreshOnUpdate) {
      this.swiper.slideTo(0, 0, false)
    }

    this.swiper.update(true)
  }

  componentWillUnmount() {
    this.swiper = null
  }

  render() {
    return (
      <div className={`scroller component ${this.props.className}`}>
        <div ref="container" className="swiper-container">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              {this.props.children}
            </div>
          </div>
          <div ref="scrollbar" className="swiper-scrollbar"></div>
        </div>
      </div>
    )
  }
}

Scroller.defaultProps = {
  onReachEnd: null,
  className: '',
  refreshOnUpdate: true
}
Scroller.propTypes = {
  onReachBeginning: PropTypes.func,
  onReachEnd: PropTypes.func,
  children: PropTypes.any,
  className: PropTypes.string,
  refreshOnUpdate: PropTypes.bool
}


export default Scroller
