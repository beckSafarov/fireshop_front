import { useState, useEffect } from 'react'

const DeliveryProgress = ({
  height,
  width,
  progress,
  completedColor,
  uncompletedColor,
  lineColor,
}) => {
  const startHeight = height / 2
  const r = width * 0.0384
  const firstEnding = 10 + 2 * r
  const lastEnding = width - 2 * r
  const distance = (lastEnding - firstEnding - 10) / 3
  const [delvProgress, setDelvProgress] = useState(0)

  useEffect(() => setDelvProgress(progress), [progress])

  const firstCircleX = 10 + r
  const secondCircleX = firstCircleX + r + distance
  const thirdCircleX = secondCircleX + r + distance
  const fourthCircleX = width - r - 20

  const stepCircles = [
    { cx: firstCircleX, label: 'Received' },
    { cx: secondCircleX, label: 'Packed' },
    { cx: thirdCircleX, label: 'Shipped' },
    { cx: fourthCircleX, label: 'Delivered' },
  ]

  return (
    <svg className='svg' height={height} width={width}>
      <line
        x1={firstEnding}
        y1={startHeight}
        x2={lastEnding}
        y2={startHeight}
        style={{ strokeWidth: '2', stroke: lineColor }}
      />
      {stepCircles.map((circle, i) => (
        <g key={i}>
          <circle
            cx={circle.cx}
            cy={startHeight}
            r={r}
            fill={delvProgress >= i ? completedColor : 'white'}
            stroke={delvProgress >= i ? completedColor : uncompletedColor}
            strokeWidth='2'
          />
          <text
            x={circle.cx - (i === 1 ? 1.25 : 1.5) * r}
            y={startHeight + 2 * r}
            fill={delvProgress >= i ? completedColor : uncompletedColor}
          >
            {circle.label}
          </text>
        </g>
      ))}
      Sorry, your browser does not support inline SVG.
    </svg>
  )
}

DeliveryProgress.defaultProps = {
  height: 220,
  width: 500,
  radius: 20,
  progress: 1,
  completedColor: 'blue',
  uncompletedColor: '#8080ff',
  lineColor: '#bfbfbf',
}

export default DeliveryProgress
