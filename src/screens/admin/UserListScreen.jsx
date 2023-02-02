// libraries & methods
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// UI components
import { Table } from 'react-bootstrap'
import { Loader, Spinner, SearchUser, FlashMsg } from '../../components'

// redux actions
import { listUsers, deleteUser, searchUser } from '../../actions/adminActions'
import {
  ADMIN_SEARCH_PROPERTY_RESET as searchPropReset,
  ADMIN_SEARCH_USER_RESET,
  ADMIN_USER_DELETE_RESET,
  ADMIN_USER_UPDATE_RESET,
} from '../../constants'
import UserEditModal from '../../components/Modals/UserEditModal'
import { getUserAddress } from '../../helpers/utilities'

const tableHeadings = ['id', 'name', 'email', 'address', 'actions']

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()

  // all users store
  const {
    loading: listLoading,
    error: listRequestError,
    users: allUsers,
  } = useSelector((state) => state.userList)

  // user delete store
  const {
    loading: deleteLoading,
    success: deleted,
    error: deleteError,
    message: deleteSuccessMsg,
  } = useSelector((state) => state.adminUserDelete)

  // search user store
  const {
    loading: searchLoading,
    users: searchedUsers,
    error: searchFailed,
  } = useSelector((state) => state.adminSearchUserStore)
  const [users, setUsers] = useState([])

  const { success: updated } = useSelector((state) => state.adminUserUpdate)

  const [flashMsg, setFlashMsg] = useState({})

  const [modal, setModal] = useState({
    display: false,
    userInfo: null,
  })

  // variables
  const listAllUsers = (!allUsers || allUsers.length === 0) && !searchedUsers

  useEffect(() => {
    listAllUsers ? dispatch(listUsers()) : setUsers(allUsers)

    if (deleted || deleteError) {
      setFlashMsg({
        variant: deleted ? 'success' : 'danger',
        msg: deleteSuccessMsg || deleteError,
      })
      dispatch({ type: ADMIN_USER_DELETE_RESET })
    }

    if (updated) {
      setFlashMsg({ variant: 'success', msg: 'Updated successfully' })
      dispatch({ type: ADMIN_USER_UPDATE_RESET })
    }

    if (searchedUsers) setUsers(searchedUsers)

    if (searchFailed) {
      setFlashMsg({ variant: 'danger', msg: searchFailed })
      dispatch({ type: searchPropReset, payload: 'error' })
    }

    if (listRequestError) {
      setFlashMsg({ variant: 'danger', msg: listRequestError })
    }

    return () => {
      axios.CancelToken.source().cancel()
      searchedUsers && handleClearSearch()
    }
  }, [
    dispatch,
    deleted,
    deleteError,
    updated,
    allUsers,
    searchedUsers,
    searchFailed,
    listRequestError,
  ])

  const handleDelete = (id, name = 'undefined') => {
    const c = `Are you sure to delete ${name}?`
    window.confirm(c) && dispatch(deleteUser(id))
  }

  const handleModal = (userInfo, display = true) =>
    setModal({ display, userInfo })

  const handleSearch = (q) => {
    dispatch(searchUser(q.searchBy, q.searchAddressBy, q.keyword))
  }

  const handleClearSearch = () => dispatch({ type: ADMIN_SEARCH_USER_RESET })

  return (
    <>
      {listLoading ? (
        <Loader />
      ) : (
        <>
          <h1>Users</h1>
          <FlashMsg
            variant={flashMsg.variant}
            permanent={Boolean(listRequestError)}
          >
            {flashMsg.msg}
          </FlashMsg>
          <div className='py-4'>
            <SearchUser onSearch={handleSearch} onClear={handleClearSearch} />
          </div>

          <Spinner hidden={!deleteLoading || !searchLoading} />
          {users && users.length > 0 && (
            <Table responsive className='tale-sm'>
              <thead>
                <tr>
                  {tableHeadings.map((t, i) => (
                    <th key={i}>{t.toLocaleUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>
                      {user.name}{' '}
                      {user.isAdmin && (
                        <i
                          style={{ color: '#00cc66', fontSize: '10px' }}
                          className='fas fa-check-circle'
                        ></i>
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>{getUserAddress(user.shippingAddress)}</td>
                    <td>
                      <div className='two-horizontal-icons'>
                        <div>
                          <i
                            onClick={() => handleModal(user)}
                            className='fas fa-edit'
                          ></i>
                        </div>
                        <div>
                          <i
                            onClick={() => handleDelete(user._id, user.name)}
                            className='fas fa-trash'
                          ></i>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <UserEditModal
            modal={modal}
            onClose={() => setModal({ display: false })}
          />
        </>
      )}
    </>
  )
}

export default UserListScreen
