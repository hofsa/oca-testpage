export const enum OverlaySpecType {
  META_1_0 = 'spec/overlays/meta/1.0',
  FORMAT_1_0 = 'spec/overlays/format/1.0',
  STANDARD_1_0 = 'spec/overlays/standard/1.0',
  LABEL_1_0 = 'spec/overlays/label/1.0',
  BRANDING_1_0 = 'aries/overlays/branding/1.0',
  BRANDING_1_1 = 'aries/overlays/branding/1.1',
  DATA_SOURCE_1_0 = 'extend/overlays/data_source/1.0',
  CLUSTER_ORDERING_1_0 = 'extend/overlays/cluster_ordering/1.0'
}

export const OverlayTypes = {
  META: OverlaySpecType.META_1_0,
  FORMAT: OverlaySpecType.FORMAT_1_0,
  STANDARD: OverlaySpecType.STANDARD_1_0,
  LABEL: OverlaySpecType.LABEL_1_0,
  BRANDING: [OverlaySpecType.BRANDING_1_1, OverlaySpecType.BRANDING_1_0],
  DATA_SOURCE: OverlaySpecType.DATA_SOURCE_1_0,
  CLUSTER_ORDERING: OverlaySpecType.CLUSTER_ORDERING_1_0
} as const;

/** https://oca.colossi.network/specification/#common-attributes */
export type CommonOverlay<Type extends OverlaySpecType> = {
  type: Type;
  capture_base: string;
};
export type CommonLocalizedOverlay<Type extends OverlaySpecType> = CommonOverlay<Type> & {
  language: string;
};

/** https://oca.colossi.network/specification/#meta-overlay */
export type MetaOverlay = CommonLocalizedOverlay<OverlaySpecType.META_1_0> & {
  name: string;
  description?: string;
};

/** https://oca.colossi.network/specification/#format-overlay */
export type FormatOverlay = CommonOverlay<OverlaySpecType.FORMAT_1_0> & {
  attribute_formats: Record<string, string>;
};

/** https://oca.colossi.network/specification/#standard-overlay */
export type StandardOverlay = CommonOverlay<OverlaySpecType.STANDARD_1_0> & {
  attr_standards: Record<string, string>;
};

/** https://oca.colossi.network/specification/#label-overlay */
export type LabelOverlay = CommonLocalizedOverlay<OverlaySpecType.LABEL_1_0> & {
  attribute_labels: Record<string, string>;
};

/** https://github.com/decentralized-identity/aries-rfcs/blob/main/features/0755-oca-for-aries/README.md#aries-specific-branding-overlay */
export type BrandingOverlay1_0 = CommonOverlay<OverlaySpecType.BRANDING_1_0> & {
  logo: string;
  primary_background_color: string;
  primary_attribute?: string;
  secondary_attribute?: string;
};

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#aries-branding-overlay-update-proposal */
export type BrandingOverlay1_1 = CommonOverlay<OverlaySpecType.BRANDING_1_1> & {
  language?: string;
  theme?: string;
  logo: string;
  primary_background_color: string;
  primary_field?: string;
  secondary_field?: string;
  background_image?:string;
  background_image_slice?:string;
  secondary_background_color?: string;
};

export type BrandingOverlay = BrandingOverlay1_0 | BrandingOverlay1_1;

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#data-source-mapping-overlay */
export type DataSourceOverlay = CommonOverlay<OverlaySpecType.DATA_SOURCE_1_0> & {
  format: string;
  attribute_sources: Record<string, string>;
};

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#cluster-ordering-overlay */
export type ClusterOrderingOverlay =
  CommonLocalizedOverlay<OverlaySpecType.CLUSTER_ORDERING_1_0> & {
    cluster_order: Record<string, number>;
    attribute_cluster_order: Record<string, Record<string, number>>;
    cluster_labels?: Record<string, string>;
  };

export type AnyOverlay =
  | MetaOverlay
  | FormatOverlay
  | StandardOverlay
  | LabelOverlay
  | BrandingOverlay
  | DataSourceOverlay
  | ClusterOrderingOverlay;

export type Overlay<Type extends AnyOverlay['type']> = Extract<AnyOverlay, { type: Type }>;
