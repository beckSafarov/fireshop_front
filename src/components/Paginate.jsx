import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, activePage, linkHead }) => {
  if (pages < 2) return <></>
  return (
    <Pagination>
      {[...Array(pages).keys()].map((currPage, i) => (
        <LinkContainer key={i} to={`${linkHead}/${currPage + 1}`}>
          <Pagination.Item active={activePage === currPage + 1}>
            {currPage + 1}
          </Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  )
}

Paginate.defaultProps = {
  pages: 0,
  linkHead: '/page',
}

export default Paginate
