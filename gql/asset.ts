export const ASSET_FRAGMENT = /* GraphQL */ `
    id
    name
    width
    height
    source
`;

export const ADMIN_ASSETS = /* GraphQL */ `
  query Assets($options: AssetListOptions) {
    assets(options: $options) {
      items {
        id
        createdAt
        updatedAt
        name
        type
        fileSize
        mimeType
        width
        height
        source
        preview
      }
      totalItems
    }
  }
`;
