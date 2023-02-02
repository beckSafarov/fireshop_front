import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { getURLParam } from '../helpers/utilities'
import Spinner from './globals/Spinner'

const ProtectedRoute = ({
  component: Component,
  unloggedOnly,
  adminOnly,
  ...rest
}) => {
  const { loading, userInfo: logged } = useSelector((state) => state.userLogin)

  const [permit, setPermit] = useState(null)
  const [redirect, setRedirect] = useState('/')

  useEffect(() => {
    if (unloggedOnly) handleUnloggedOnly()
    if (adminOnly) handleAdminOnly()

    if (!unloggedOnly && !adminOnly) {
      handlePrivate()
    }
  }, [unloggedOnly, adminOnly, logged])

  const handlePrivate = () => {
    if (logged === false) {
      const currPage = window.location.href.split('/').pop()
      setRedirect(`/signin?redirect=${currPage}`)
      setPermit(false)
      return
    }
    setPermit(true)
  }

  const getRedirectQuery = () => {
    const query = getURLParam('redirect')
    return query === '/' ? '' : query
  }

  const handleUnloggedOnly = () => {
    setPermit(!Boolean(logged))
    if (!logged) return
    const redirectQuery = getRedirectQuery()
    setRedirect(`/${redirectQuery}`)
  }

  const handleAdminOnly = () => {
    setPermit(logged && logged.isAdmin)
  }

  return (
    <Route
      {...rest}
      render={() =>
        permit ? (
          <Component />
        ) : loading || logged === null ? (
          <Spinner />
        ) : (
          permit === false && <Redirect to={{ pathname: redirect }} />
        )
      }
    />
  )
}

ProtectedRoute.defaultProps = {
  unloggedOnly: false,
  adminOnly: false,
}

export default ProtectedRoute
