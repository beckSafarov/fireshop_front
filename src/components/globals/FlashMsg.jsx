import { useEffect } from 'react'
import { Alert } from 'react-bootstrap'

const FlashMsg = ({ variant, children, clearChildren, seconds, permanent }) => {
  useEffect(() => {
    if (children && !permanent) {
      setTimeout(clearChildren, seconds * 1000)
    }
  }, [children, permanent, seconds])

  return children ? <Alert variant={variant}>{children}</Alert> : <></>
}

FlashMsg.defaultProps = {
  variant: 'info',
  permanent: false,
  clearChildren: () => void 0,
  seconds: 3,
}

export default FlashMsg
