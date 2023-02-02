import React from 'react'
import PropTypes from 'prop-types'

const Rating = ({ value, text, color }) => {
  return (
    <div className='rating'>
      <span style={{ cursor: 'pointer' }}>
        {[...Array(5).keys()].map((n, key) => (
          <i
            style={{ color, cursor: 'pointer' }}
            key={key}
            className={
              value >= n + 1
                ? 'fas fa-star'
                : value === n - 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        ))}
      </span>
      <span className='rating span'> {text}</span>
    </div>
  )
}

Rating.defaultProps = {
  color: '#FFB500',
  text: '',
  value: 0,
}

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string,
  color: PropTypes.string,
}

export default Rating
