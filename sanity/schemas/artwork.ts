import { defineField, defineType } from 'sanity'

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork / Obra de Arte',
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
      name: 'category',
      title: 'Category / Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Painting / Pintura', value: 'painting' },
          { title: 'Sculpture / Escultura', value: 'sculpture' },
          { title: 'Sketch / Boceto', value: 'sketch' },
          { title: 'Photography / Fotografía', value: 'photography' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image / Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube/Vimeo)',
      type: 'url',
      description: 'Optional: Paste a YouTube or Vimeo URL',
    }),
    defineField({
      name: 'year',
      title: 'Year / Año',
      type: 'number',
      validation: (Rule) => Rule.min(1900).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions / Dimensiones',
      type: 'string',
      description: 'e.g., 24" x 36" or 60cm x 90cm',
    }),
    defineField({
      name: 'medium',
      title: 'Medium / Técnica',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English', description: 'e.g., Oil on canvas' },
        { name: 'es', type: 'string', title: 'Español', description: 'e.g., Óleo sobre lienzo' },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description / Descripción',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'es', type: 'text', title: 'Español', rows: 3 },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured / Destacado',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order / Orden',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Year (Newest)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      titleEs: 'title.es',
      category: 'category',
      year: 'year',
      media: 'image',
    },
    prepare({ title, titleEs, category, year, media }) {
      return {
        title: title || titleEs || 'Untitled',
        subtitle: `${category} ${year ? `(${year})` : ''}`,
        media,
      }
    },
  },
})
