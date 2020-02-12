// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { MetaDataApiResponse, MetaDataAttribute } from '@/types/ApiResponse'
import { getCategoricals } from './utils'
import { FilterDefinition } from '@/types/ApplicationState'

const mapMetaToFilters = async (meta: MetaDataApiResponse) => {
  let shownFilters:string[] = []
                       
  const attrs = meta.data.attributes.items.map(item => item.data)

  // TODO: map all filters
  const categoricals = await Promise.all(getCategoricals(attrs).map(async (item) => {
    const href = item && item.refEntityType && item.refEntityType.self

    if (!href) throw new Error('categorical without self ref')

    const options = await getOptions(href)
    shownFilters.push(item.name)

    return {
      name: item.name,
      label: item.label,
      type: 'checkbox-filter',
      options: options,
      collapsable: true,
      collapsed: false
    }
  }))

  return {
    definition: categoricals,
    shown: shownFilters
  }
}

const getOptions = async (href: string) => {
  const resp = await api.get(href)
  return () => {
    return Promise.resolve(
      resp.items.map((item: any) => ({ value: item[resp.meta.idAttribute], text: item[resp.meta.labelAttribute] }))
    )
  }
}

export {
  mapMetaToFilters
}
