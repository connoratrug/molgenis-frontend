import { MetaDataAttribute, MetaDataApiResponseAttribute } from '@/types/ApiResponse'

export const getCategoricals = (attributes: MetaDataApiResponseAttribute[]): MetaDataApiResponseAttribute[] => attributes.filter(item => item.type.includes('categorical'))
