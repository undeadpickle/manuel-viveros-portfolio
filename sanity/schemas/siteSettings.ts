import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings / Configuración del Sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'artistName',
      title: 'Artist Name / Nombre del Artista',
      type: 'string',
      initialValue: 'Manuel Viveros Segura',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / Lema',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'es', type: 'string', title: 'Español' },
      ],
    }),
    defineField({
      name: 'artistStatement',
      title: 'Artist Statement / Declaración del Artista',
      type: 'object',
      description: 'Shown on the homepage',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 5 },
        { name: 'es', type: 'text', title: 'Español', rows: 5 },
      ],
    }),
    defineField({
      name: 'signature',
      title: 'Signature / Firma',
      type: 'image',
      description: 'Your signature image (PNG with transparent background preferred)',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      initialValue: 'viveroscinco@yahoo.com',
    }),
    defineField({
      name: 'phone',
      title: 'Phone / Teléfono',
      type: 'string',
      initialValue: '1 (408) 205-6916',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links / Redes Sociales',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Behance', value: 'behance' },
                ],
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
            },
            prepare({ platform, url }) {
              return {
                title: platform?.charAt(0).toUpperCase() + platform?.slice(1) || 'Social Link',
                subtitle: url,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'es', type: 'string', title: 'Español' },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            { name: 'en', type: 'text', title: 'English', rows: 2 },
            { name: 'es', type: 'text', title: 'Español', rows: 2 },
          ],
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image shown when sharing on social media (recommended: 1200x630)',
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global configuration',
      }
    },
  },
})
