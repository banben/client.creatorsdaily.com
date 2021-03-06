import { Button, Timeline } from 'antd'
import styled from 'styled-components'
import get from 'lodash/get'
import Link from 'next/link'
import { ClockCircleOutlined, FlagFilled, PlusOutlined } from '@ant-design/icons'
import useCreateMilestoneModal from '../hooks/useCreateMilestoneModal'
import useCanEditProduct from '../hooks/useCanEditProduct'
import { GET_PRODUCT } from '../queries'
import Time from './Time'
import ProductContent from './ProductContent.dynamic'

const Milestones = styled.div`
padding: 24px;
background: #FFF;
`

const MilestoneTime = styled.div`
  font-size: 12px;
  font-weight: bold;
  line-height: 24px;
  margin-bottom: 8px;
`

const MilestoneTitle = styled.h4`
  margin-bottom: 0;
  font-weight: bold;
`

const MilestoneButton = styled(Button)`
  margin: 0 auto;
`

const MilestoneContent = styled(ProductContent)`
font-size: 12px;
img {
  max-width: 200px !important;
}
`

export default ({
  productId,
  product = {},
  renderHeader = () => null
}) => {
  const {
    discovererId,
    milestones, creators,
    createdAt
  } = product
  const canEdit = useCanEditProduct({ creators, discovererId })
  const renderCreatorMilestone = () => {
    if (!canEdit) return null
    return (
      <Timeline.Item color='red' dot={<ClockCircleOutlined />}>
        <MilestoneTime>现在，立刻发布新动态</MilestoneTime>
        <MilestoneButton icon={<PlusOutlined />} onClick={show}>
          发布新里程碑
        </MilestoneButton>
      </Timeline.Item>
    )
  }
  const milestonesList = get(milestones, 'data', [])
  const [modal, show] = useCreateMilestoneModal(productId, {
    refetchQueries: () => [{
      query: GET_PRODUCT,
      variables: { id: productId }
    }]
  })
  return (
    <Milestones>
      {modal}
      {renderHeader()}
      <Timeline>
        {renderCreatorMilestone()}
        {milestonesList.map(x => (
          <Timeline.Item key={x.id}>
            <MilestoneTime>
              <Time time={x.createdAt} />
            </MilestoneTime>
            <MilestoneTitle>
              <Link
                href='/[id]/milestones/[milestoneId]'
                as={`/${productId}/milestones/${x.id}`}
              >
                <a>
                  {x.title}
                </a>
              </Link>
            </MilestoneTitle>
            <MilestoneContent height={80} full content={x.content.slice(0, 400) + (x.content.length > 400 ? '...' : '')} background='linear-gradient(rgba(250,250,250,0), rgba(250,250,250,1))' />
          </Timeline.Item>
        ))}
        <Timeline.Item color='green' dot={<FlagFilled />}>
          <MilestoneTime>
            <Time time={createdAt} />
          </MilestoneTime>
          <MilestoneTitle style={{ fontWeight: 'normal' }}>在 <strong>{process.env.NAME}</strong> 首次发布</MilestoneTitle>
        </Timeline.Item>
      </Timeline>
    </Milestones>
  )
}
