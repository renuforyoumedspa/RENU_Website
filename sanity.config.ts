'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision lets an editor run raw GROQ queries against the dataset from
    // within Studio — handy for debugging content, not needed by patients
    // or the practice's day-to-day editors, but harmless to leave in.
    visionTool({ defaultApiVersion: apiVersion })
  ]
});
