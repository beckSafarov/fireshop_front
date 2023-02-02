import { useState } from 'react'

const Rate = ({ stars, setStars, color }) => {
  const [oldStars, setOldStars] = useState(stars)
  const fullStar = 'fas fa-star'
  const emptyStar = 'far fa-star'

  const handleMouseOver = (e) => {
    setOldStars(stars)
    setStars(Number(e.target.id))
  }

  const handleMouseleave = (e) => setStars(oldStars)

  const handleClick = (e) => {
    setOldStars(Number(e.target.id))
    setStars(Number(e.target.id))
  }

  return (
    <div className='longer-rating'>
      <span>
        {[...Array(5).keys()].map((n, key) => (
          <i
            style={{ color }}
            key={key}
            id={n + 1}
            className={n === 0 || stars > n ? fullStar : emptyStar}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseleave}
            onClick={handleClick}
          ></i>
        ))}
      </span>
    </div>
  )
}

Rate.defaultProps = {
  stars: 5,
  setStars: (v) => (Rate.defaultProps.stars = v),
  color: '#FFB500',
}

export default Rate
