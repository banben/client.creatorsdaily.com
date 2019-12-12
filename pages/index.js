import React, { Fragment } from 'react'
import { Button, Col, Empty, Row, Spin } from 'antd'
import get from 'lodash/get'
import styled from 'styled-components'
import Link from 'next/link'
import { useQuery } from '@apollo/react-hooks'
import { useRouter } from 'next/router'
import Page from '../layouts/Page'
import Container from '../components/Container'
import ProductCell from '../components/ProductCell'
import { GET_POSTS, GET_PRODUCTS } from '../queries'
import usePagination from '../hooks/usePagination'
import { TopicList, TopicsBar } from '../components/Topics'
import RightSide from '../components/RightSide'
import media from '../libs/media'
import PostCell from '../components/PostCell'
import SmallTitle from '../components/SmallTitle'
import MilestoneList from '../components/MilestoneList'
import withApollo from '../libs/with-apollo'

const StyledContainer = styled(Container)`
${media.lg`
margin-top: 24px;
`}
`

const Pagination = styled.div`
padding: 0 24px;
margin-bottom: 24px;
${media.sm`
  padding: 0;
`}
`

const StyledPostCell = styled(PostCell)`
margin-bottom: 12px;
`

const CreateButton = styled.a`
margin: 0 24px 24px;
display: block;
${media.sm`
  margin: 0 0 24px;
`}
`

const StyledTopicsBar = styled(TopicsBar)`
padding: 0 16px;
${media.sm`
  padding: 0;
`}
`

export default withApollo(() => {
  const { query: { topic, page } } = useRouter()
  const {
    result: {
      loading,
      data
    },
    pagination
  } = usePagination({
    path: '/',
    query: GET_PRODUCTS,
    getTotal: ({ data }) => get(data, 'getProducts.total', 0)
  })

  const { data: postsData, loading: postsLoading } = useQuery(GET_POSTS, {
    variables: {
      size: 1
    },
    skip: (!!topic || !!Number(page))
  })

  const products = get(data, 'getProducts.data', [])
  const posts = get(postsData, 'getPosts.data', [])
  const renderList = () => {
    if (products.length) {
      return products.map(product => (
        <ProductCell {...product} key={product.id} />
      ))
    }
    return (
      <Empty description='暂无内容' image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  }
  const renderPosts = () => {
    if (!posts.length) {
      return (<div style={{ height: postsLoading ? 30 : 0 }} />)
    }
    return (
      <Fragment>
        {posts.map(post => (
          <StyledPostCell flag='每日精选' {...post} key={post.id} />
        ))}
      </Fragment>
    )
  }
  const renderMilestones = () => {
    if (!!topic || !!Number(page)) return null
    return (
      <>
        <SmallTitle>
          <Link href='/milestones'>
            <a>
            里程碑
            </a>
          </Link>
        </SmallTitle>
        <MilestoneList size={3} />
      </>
    )
  }
  return (
    <Page>
      <StyledContainer>
        <Row gutter={24}>
          <Col xs={24} lg={0}>
            <StyledTopicsBar href='/' checkable />
          </Col>
          <Col lg={5} xs={0}>
            <TopicList href='/' />
          </Col>
          <Col lg={13} md={16} xs={24}>
            <Spin spinning={postsLoading}>
              {renderPosts()}
            </Spin>
            {renderMilestones()}
            <SmallTitle>产品展区</SmallTitle>
            <Spin spinning={loading}>
              {renderList()}
            </Spin>
            <Pagination>
              {pagination}
            </Pagination>
          </Col>
          <Col lg={6} md={8} xs={24}>
            <Link href='/create' passHref>
              <CreateButton>
                <Button type='primary' icon='plus' size='large' block>发布产品</Button>
              </CreateButton>
            </Link>
            <RightSide />
          </Col>
        </Row>
      </StyledContainer>
    </Page>
  )
})
