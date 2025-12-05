import { defineField, defineType } from 'sanity'

export const journal = defineType({
  name: 'journal',
  title: 'Journal / Diario',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Título',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'es', type: 'string', title: 'Español' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date / Fecha de Publicación',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Imagen de Portada',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Extracto',
      type: 'object',
      description: 'Short preview text for listing pages',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 2 },
        { name: 'es', type: 'text', title: 'Español', rows: 2 },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content / Contenido',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt text',
                },
              ],
            },
          ],
        },
        {
          name: 'es',
          title: 'Español',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Leyenda',
                },
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texto alternativo',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery / Galería de Fotos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'object',
              title: 'Caption / Leyenda',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'es', type: 'string', title: 'Español' },
              ],
            },
          ],
        },
      ],
      description: 'Optional: Add a photo gallery to this journal entry',
    }),
    defineField({
      name: 'location',
      title: 'Location / Ubicación',
      type: 'string',
      description: 'Optional: Where this was written or took place',
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],
  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      titleEs: 'title.es',
      date: 'publishedAt',
      location: 'location',
      media: 'coverImage',
    },
    prepare({ title, titleEs, date, location, media }) {
      const displayDate = date ? new Date(date).toLocaleDateString() : ''
      return {
        title: title || titleEs || 'Untitled',
        subtitle: [displayDate, location].filter(Boolean).join(' - '),
        media,
      }
    },
  },
})
