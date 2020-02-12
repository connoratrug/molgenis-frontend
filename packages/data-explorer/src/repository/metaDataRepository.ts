import axios from 'axios'
import { MetaDataApiResponse } from '@/types/ApiResponse'

const metaDataCache: { [s: string]: MetaDataApiResponse } = {}

// Todo placeholder until we have a metadataApi
const fetchMetaData = async (entityId: string) => {
  if (metaDataCache[entityId]) {
    return metaDataCache[entityId]
  }

  const response = <MetaDataApiResponse> await axios.get(`/api/metadata/${entityId}`)
  metaDataCache[entityId] = response
  return response
}

export {
  fetchMetaData
}
