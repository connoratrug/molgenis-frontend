<template>
  <div>
    <button v-for="(activeFilter, index) in activeFilters" :key="`af-${index}`"  type="button" class="btn btn-light mr-1 btn-outline-secondary"> {{ activeFilter }} <font-awesome-icon icon="times" class="ml-1"></font-awesome-icon></button>
   </div>
</template>

<script>
import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTimes)

export default Vue.extend({
  name: 'ActiveFilters',
  components: { FontAwesomeIcon },
  props: {
    filter: {
      type: Object,
      required: true
    }
  },
  computed: {
    activeFilters () {
      return Object.values(this.filter).reduce((accum, item) => {
        if (typeof item == 'string') {
          accum.push(item)
        } else {
          accum = accum.concat(item)
        }
        return accum
      }, [])
    }
  }
})
</script>

<style scoped>
  button svg path {
    transition: fill 0.3s;
  }
  button:hover svg path {
    fill: var(--danger);
  }
</style>
