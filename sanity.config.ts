import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'manuel-viveros-studio',
  title: 'Manuel Viveros Portfolio',

  projectId,
  dataset,
  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Site Settings - singleton
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
            S.divider(),
            // Artwork by category
            S.listItem()
              .title('Paintings / Pinturas')
              .child(
                S.documentList()
                  .title('Paintings')
                  .filter('_type == "artwork" && category == "painting"')
              ),
            S.listItem()
              .title('Sculptures / Esculturas')
              .child(
                S.documentList()
                  .title('Sculptures')
                  .filter('_type == "artwork" && category == "sculpture"')
              ),
            S.listItem()
              .title('Sketches / Bocetos')
              .child(
                S.documentList()
                  .title('Sketches')
                  .filter('_type == "artwork" && category == "sketch"')
              ),
            S.listItem()
              .title('Photography / Fotografía')
              .child(
                S.documentList()
                  .title('Photography')
                  .filter('_type == "artwork" && category == "photography"')
              ),
            S.listItem()
              .title('All Artwork / Todo el Arte')
              .child(S.documentTypeList('artwork').title('All Artwork')),
            S.divider(),
            // Journals
            S.listItem()
              .title('Journals / Diario')
              .child(S.documentTypeList('journal').title('Journals')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
