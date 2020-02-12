import axios from 'axios'
import { StringMap } from '../types/GeneralTypes'
import { MetaDataApiResponse } from '@/types/ApiResponse'

const metaDataCache:StringMap = {}

// Todo placeholder until we have a metadataApi
const fetchMetaData = async (entityId: string) => {
  if (metaDataCache[entityId]) {
    return metaDataCache[entityId]
  }

  const resp = await axios.get<MetaDataApiResponse>(`/api/metadata/${entityId}`)
  resp.
  metaDataCache[entityId] = resp.meta
  // @ts-ignore
  return resp.meta
}

export {
  fetchMetaData
}c
