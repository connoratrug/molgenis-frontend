<template>
  <v-select :options="options" :clearable="false" :value="selectedOption" ></v-select>
</template>

<script>
import axios from 'axios'
const client = axios.create({ baseURL: '/api/data/' })

export default {
  name: 'EntitySelect',
  props: {
    selectedEntityId: {
      type: String,
      required: false,
      default: () => null
    },
    includeSystem: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data: () => ({
    options: [],
    pageDetails: null
  }),
  computed: {
    selectedOption () {
      return this.options.find(option => option.id === this.selectedEntityId)
    }
  },
  methods: {
    async fetchOptions () {
      const path = 'sys_md_EntityType'
      const size = 'size=100'
      const attrs = 'filter=id,label,description'
      const query = this.includeSystem ? 'q=isAbstract==(false);package!=(sys)' : 'q=isAbstract==(false)'
      const optionsResp = await client.get(`${path}?${size}&${attrs}&${query}`)
      this.options = optionsResp.data.items.map(item => ({ id: item.data.id, label: item.data.label }))
      this.pageDetails = optionsResp.data.page
    }
  },
  created: function () {
    this.fetchOptions()
  }
}
</script>

<style>

</style>

<docs>
  Component to select a entity

  ## Example

  ```jsx
  let selectedEntityId = 'demo_books'

  <entity-select
    v-bind:includeSystem="true"
    v-bind:selectedEntityId="selectedEntityId">
  </entity-select>
  ```
</docs>
