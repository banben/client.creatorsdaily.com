import useViewer from './useViewer'

export default ({ creators, discovererId }) => {
  const { viewer } = useViewer()
  const isCreator = (creators || []).some(x => x.id === (viewer && viewer.id))
  const isDiscoverer = discovererId === (viewer && viewer.id)
  return isCreator || (isDiscoverer && !creators.length)
}
