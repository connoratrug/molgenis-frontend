import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import PageHeaderView from '@/views/PageHeaderView.vue'

describe('PageHeaderView', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  let store: any
  let state: any
  let actions: any
  let modules: any

  beforeEach(() => {
    state = {
      tableSettings: {},
      settingsTable: 'settingsTable',
      tableMeta: {
        label: 'lbl',
        description: 'desc'
      }
    }

    actions = {}

    modules = {
      header: {
        namespaced: true,
        state: {
          packageTables: []
        },
        actions: {
          getGroupTabels: jest.fn()
        }
      }
    }

    store = new Vuex.Store({
      state, actions, modules
    })
  })

  it('exists', () => {
    const wrapper = shallowMount(PageHeaderView, { store, localVue })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('show table name and description', () => {
    const wrapper = shallowMount(PageHeaderView, { store, localVue })
    // todo replace with breadcrumb entity picker
    // expect(wrapper.find('h1').text()).toEqual('lbl')
    expect(wrapper.find('em').text()).toEqual('desc')
  })
})