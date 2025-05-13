import { SchemaObject } from 'ajv';
import { CaptureBaseSpecType, OverlaySpecType } from '../model';

const SAID_PATTERN = /^[A-Za-z0-9_\-]+$/.source;

const CAPTURE_BASE_ATTRIBUTE: SchemaObject = {
  $id: 'CaptureBaseAttribute',
  anyOf: [
    {
      $id: 'BaseAttribute',
      enum: ['Text', 'DateTime', 'Numeric', 'Boolean']
    },
    {
      $id: 'RefAttribute',
      type: 'string',
      pattern: /^refs:[A-Za-z0-9_\-]+$/.source
    },
    {
      $id: 'ArrayAttribute',
      type: 'string',
      pattern: /^Array\[.+\]$/.source
    }
  ]
};

export const CAPTURE_BASE_SCHEMA: SchemaObject = {
  $id: CaptureBaseSpecType.BASE_1_0,
  type: 'object',
  properties: {
    type: { const: CaptureBaseSpecType.BASE_1_0 },
    digest: {
      type: 'string',
      pattern: SAID_PATTERN
    },
    classification: { type: 'string' },
    attributes: {
      type: 'object',
      additionalProperties: CAPTURE_BASE_ATTRIBUTE
    },
    flagged_attributes: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['digest', 'type', 'attributes']
};

// Overlays
const COMMON = {
  properties: {
    capture_base: { type: 'string' }
  },
  required: ['type', 'capture_base']
};

const COMMON_LOCALIZED = {
  properties: {
    ...COMMON.properties,
    language: { type: 'string' }
  },
  required: [...COMMON.required, 'language']
};

const META_OVERLAY_SCHEMA: SchemaObject = {
  $id: OverlaySpecType.META_1_0,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.META_1_0 },
    ...COMMON_LOCALIZED.properties,
    name: { type: 'string' },
    description: { type: 'string' }
  },
  additionalProperties: false,
  required: [...COMMON_LOCALIZED.required, 'name']
};

const FORMAT_OVERLAY_SCHEMA: SchemaObject = {
  $id: OverlaySpecType.FORMAT_1_0,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.FORMAT_1_0 },
    ...COMMON.properties,
    attribute_formats: {
      type: 'object',
      additionalProperties: { type: 'string' }
    }
  },
  additionalProperties: false,
  required: [...COMMON.required, 'attribute_formats']
};

const STANDARD_OVERLAY_SCHEMA: SchemaObject = {
  $id: OverlaySpecType.STANDARD_1_0,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.STANDARD_1_0 },
    ...COMMON.properties,
    attr_standards: {
      type: 'object',
      additionalProperties: { type: 'string' }
    }
  },
  additionalProperties: false,
  required: [...COMMON.required, 'attr_standards']
};

const LABEL_OVERLAY_SCHEMA: SchemaObject = {
  $id: OverlaySpecType.LABEL_1_0,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.LABEL_1_0 },
    ...COMMON_LOCALIZED.properties,
    attribute_labels: {
      type: 'object',
      additionalProperties: { type: 'string' }
    }
  },
  additionalProperties: false,
  required: [...COMMON_LOCALIZED.required, 'attribute_labels']
};

const HEX_COLOR_CODE_PATTERN = /^#[A-Fa-f0-9]{6}$/.source;
const BRANDING_1_0_OVERLAY_SCHEMA: SchemaObject = {
  $id: OverlaySpecType.BRANDING_1_0,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.BRANDING_1_0 },
    ...COMMON.properties,
    logo: { type: 'string' },
    primary_background_color: { type: 'string', pattern: HEX_COLOR_CODE_PATTERN },
    primary_attribute: { type: 'string' },
    secondary_attribute: { type: 'string' }
  },
  required: [...COMMON.required, 'logo', 'primary_background_color']
};

const IMAGE_PATTERN = /^data:.+;base64,/.source;
const BRANDING_1_1_OVERLAY_SCHEMA: SchemaObject = {
  $id: OverlaySpecType.BRANDING_1_1,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.BRANDING_1_1 },
    ...COMMON.properties,
    language: { type: 'string' },
    theme: { type: 'string' },
    logo: { type: 'string', pattern: IMAGE_PATTERN },
    primary_background_color: { type: 'string', pattern: HEX_COLOR_CODE_PATTERN },
    primary_field: { type: 'string' },
    secondary_field: { type: 'string' },
    background_image: { type: 'string', pattern: IMAGE_PATTERN },
    background_image_slice: { type: 'string' },
    secondary_background_color: { type: 'string' , pattern: HEX_COLOR_CODE_PATTERN}
  },
  additionalProperties: false,
  required: [...COMMON.required, 'logo', 'primary_background_color']
};

const DATA_SOURCE_OVERLAY_SCHEMA: SchemaObject = {
  $id: OverlaySpecType.DATA_SOURCE_1_0,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.DATA_SOURCE_1_0 },
    ...COMMON.properties,
    format: { type: 'string' },
    attribute_sources: {
      type: 'object',
      additionalProperties: { type: 'string' }
    }
  },
  additionalProperties: false,
  required: [...COMMON.required, 'format', 'attribute_sources']
};

const CLUSTER_ORDERING_OVERLAY_SCHEMA: SchemaObject = {
  $id: OverlaySpecType.CLUSTER_ORDERING_1_0,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.CLUSTER_ORDERING_1_0 },
    ...COMMON_LOCALIZED.properties,
    cluster_order: {
      type: 'object',
      additionalProperties: { type: 'integer' }
    },
    attribute_cluster_order: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: { type: 'integer' }
      }
    },
    cluster_labels: {
      type: 'object',
      additionalProperties: { type: 'string' }
    }
  },
  additionalProperties: false,
  required: [...COMMON_LOCALIZED.required, 'cluster_order', 'attribute_cluster_order']
};

const KNOWN_OVERLAY_SCHEMAS = [
  META_OVERLAY_SCHEMA,
  FORMAT_OVERLAY_SCHEMA,
  STANDARD_OVERLAY_SCHEMA,
  LABEL_OVERLAY_SCHEMA,
  BRANDING_1_0_OVERLAY_SCHEMA,
  BRANDING_1_1_OVERLAY_SCHEMA,
  DATA_SOURCE_OVERLAY_SCHEMA,
  CLUSTER_ORDERING_OVERLAY_SCHEMA
];

const UNKNOWN_OVERLAY_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    type: {
      type: 'string'
    },
    capture_base: { type: 'string' },
    language: { type: 'string' }
  },
  additionalProperties: true,
  required: ['type', 'capture_base']
};

export const OVERLAY_SCHEMA: SchemaObject = {
  $id: 'Overlay',
  type: 'object',
  properties: {
    type: { type: 'string' },
    capture_base: {
      type: 'string',
      pattern: SAID_PATTERN
    }
  },
  required: ['type', 'capture_base'],
  allOf: KNOWN_OVERLAY_SCHEMAS.map((schema) => ({
    if: {
      properties: {
        type: { const: schema.$id }
      }
    },
    then: schema,
    else: UNKNOWN_OVERLAY_SCHEMA
  }))
};
