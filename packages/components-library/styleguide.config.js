module.exports = {
  require: [
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/bootstrap-vue/dist/bootstrap-vue.css',
    './node_modules/@fortawesome/fontawesome-free/css/all.css',
    './node_modules/vue-select/dist/vue-select.css',
    './styleguidist-setup.js'
  ],
  title: 'Molgenis Style Guide',
  components: 'src/components/**/[A-Z]*.vue',
  sections: [
    {
      name: 'Filters',
      sections: [
        {
          name: 'Types',
          components: 'src/components/filters/*.vue'
        },
        {
          name: 'Containers',
          components: 'src/components/filters/containers/*.vue'
        }
      ]
    },
    {
      name: 'UI',
      components: 'src/components/ui/*.vue'
    }
  ],
  exampleMode: 'expand',
  configureServer: (context) => {
    context.app.get('/api/data/sys_md_EntityType', (req, res) => {
      const mockEntities = [{
        id: 'demo_books',
        label: 'Books',
        description: 'demo books entity'
      }, {
        id: 'demo_authors',
        label: 'Authors'
      }, {
        id: 'catalog_orders',
        label: 'Orders'
      }, {
        id: 'catalog_biobanks',
        label: 'Biobanks'
      }]
      
      const mockEntityResp = {
        links: {
          self: 'http://localhost:6060/api/data/sys_md_EntityType?size=10&filter=id,label,description&q=isAbstract==(false);package!=sys',
          next: 'http://localhost:6060/api/data/sys_md_EntityType?size=10&filter=id,label,description&q=isAbstract==(false);package!=sys&page=1'
        },
        items: mockEntities.map(m => ({data: m})),
        page: {
          size: 4,
          totalElements: 44,
          totalPages: 11,
          number: 0
        }
      }
      
      res.json(mockEntityResp)
    })
  }
}
