import React from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import Swiper from 'swiper'
import { Loader } from 'semantic-ui-react'
import GlossaryName from 'components/common/glossary-name'

class Carousel extends React.Component {
  constructor(props) {
    super(props)

    this.swiper = null
    this.state  = { current: props.current }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.props.items, nextProps.items) ||
      this.state.current != nextState.current
    )
  }

  componentDidMount() {
    this.swiper = new Swiper(this.refs.container, {
      slidesPerView: 6,
      slidesPerGroup: this.props.step,
      spaceBetween: 10,
      mousewheelControl: true,
      grabCursor: true,
      threshold: 25,
      nextButton: '.arrow.next',
      prevButton: '.arrow.prev',
      lazyLoading: true,
      lazyLoadingInPrevNext: true,
      lazyLoadingInPrevNextAmount: 8,
      lazyPreloaderClass: 'lazy-preloader',
      breakpoints: {
        991: {
          nextButton: null,
          prevButton: null,
          slidesPerView: 'auto',
          spaceBetween: 15
        }
      }
    })
    if (this.state.current !== null) {
      const index = this.props.items.findIndex(item => {
        return item.id == this.state.current
      })

      if (index > -1) {
        this.swiper.slideTo(index, 0, false)
      }
    }

    if (this.props.onChange) {
      const self = this

      this.swiper.on('click', swiper => {
        if (!swiper.clickedSlide) { return }

        if (this.props.current !== null) {
          self.setState({
            current: swiper.clickedSlide.dataset.id
          })
        }

        this.props.onChange(
          swiper.clickedSlide.dataset.id,
          swiper,
          self
        )
      })
    }
  }

  componentDidUpdate() {
    this.swiper.update(true)

    if (this.props.current === null) {
      this.swiper.slideTo(0, undefined, false)
    }

    this.swiper.lazy.load()
  }

  componentWillUnmount() {
    this.swiper = null
  }

  render() {
    return (
      <div className="carousel component">
        <div className="basic wrapper">
          <div ref="container" className="swiper-container">
            <div className="swiper-wrapper">
              {this.props.items.map(item => {
                return (
                  <div
                    key={item.id}
                    data-id={item.id}
                    className={`swiper-slide ${(item.id == this.state.current) ? 'current' : ''}`}
                  >
                    <div
                      className="swiper-lazy image"
                      data-background={item.image}
                    >
                      <div className="lazy-preloader">
                        <Loader size="large" inverted active />
                      </div>

                      {item.locked && (
                        <div className="closed overlay" />
                      )}
                    </div>

                    <GlossaryName
                      content={item.title}
                      className="title"
                      replacement={item.replacement}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="arrow prev swiper-button-prev"></div>
        <div className="arrow next swiper-button-next"></div>
      </div>
    )
  }
}

Carousel.defaultProps = {
  items: [],
  step: 1,
  current: null,
  onChange: null
}
Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  step: PropTypes.number,
  current: PropTypes.string,
  onChange: PropTypes.func
}

export default Carousel
