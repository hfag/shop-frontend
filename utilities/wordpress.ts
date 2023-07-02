export interface BlockBase {
  blockName: string | null;
  innerHTML: string | null;
  innerContent: string[];
}

interface ParagraphBlock extends BlockBase {
  blockName: "core/paragraph";
}

interface SeperatorBlock extends BlockBase {
  blockName: "core/separator";
}

interface MappedSeperatorBlock {
  blockName: "core/separator";
}

interface ListBlock extends BlockBase {
  blockName: "core/list";
}

interface ImageBlock extends BlockBase {
  blockName: "core/image";
  attrs: {
    id: number;
  };
}

interface GalleryBlock extends BlockBase {
  blockName: "core/gallery";
  attrs:
    | {
        ids: number[];
        columns: number;
        linkTo: string;
      }
    | { urls: string[] };
}

interface MappedGalleryBlock extends BlockBase {
  blockName: "core/gallery";
  attrs: {
    urls: string[];
  };
}

export type Block =
  | ParagraphBlock
  | SeperatorBlock
  | ListBlock
  | ImageBlock
  | GalleryBlock;

export type MappedBlock =
  | null
  | ParagraphBlock
  | MappedSeperatorBlock
  | ListBlock
  | ImageBlock
  | MappedGalleryBlock;

export interface WP_Post {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  author: number;
  featured_media: number;
  sticky: boolean;
  description: string;
  _blocks: Block[];
  _embedded: {
    "wp:featuredmedia": {
      id: number;
      title: { rendered: string };
      alt_text: string;
      media_details: {
        width: number;
        height: number;
        file: string;
        sizes: {
          thumbnail?: {
            file: string;
            width: number;
            height: number;
            source_url: string;
          };
        };
      };
    }[];
  };
}

export interface Post {
  //id: number;
  slug: string;
  title: string;
  blocks: MappedBlock[];
  thumbnail: {
    url: string | null;
    width: number | null;
    height: number | null;
    alt: string | null;
  };
  //sticky: boolean;
  //description: string;
}

export type PostPreview = Omit<Post, "blocks"> & {
  sticky: boolean;
  description: string;
};

const mapBlock = (block: Block): MappedBlock => {
  switch (block.blockName) {
    case "core/separator":
      return { blockName: "core/separator" };

    case "core/gallery":
      return {
        ...block,
        attrs: {
          urls:
            "urls" in block.attrs
              ? block.attrs.urls
              : block.innerHTML
              ? (block.innerHTML.match(/src="[^ <>]+"/g) || []).map((s) =>
                  s.substr(5, s.length - 6)
                )
              : [],
        },
      };
    default:
      return {
        ...block,
        innerHTML: block.innerHTML?.replace(/\r\n\r\n/g, "<br/>") || null,
      };
  }
};

export const mapPost = (post: WP_Post): Post => {
  const hasMedia =
    post._embedded &&
    post._embedded["wp:featuredmedia"] &&
    post._embedded["wp:featuredmedia"].length > 0;

  const hasThumbnail =
    hasMedia &&
    post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail &&
    post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail;

  return {
    slug: post.slug,
    title: post.title.rendered,
    blocks: post._blocks.filter((b) => b.blockName).map(mapBlock),
    thumbnail: {
      url:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            ?.source_url) ||
        null,
      width:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            ?.width) ||
        null,
      height:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            ?.height) ||
        null,
      alt: (hasMedia && post._embedded["wp:featuredmedia"][0].alt_text) || null,
    },
  };
};

export const mapPostPreview = (post: WP_Post): PostPreview => {
  const hasMedia =
    post._embedded &&
    post._embedded["wp:featuredmedia"] &&
    post._embedded["wp:featuredmedia"].length > 0;

  const hasThumbnail =
    hasMedia &&
    post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail &&
    post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail;

  return {
    slug: post.slug,
    title: post.title.rendered,
    thumbnail: {
      url:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            ?.source_url) ||
        null,
      width:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            ?.width) ||
        null,
      height:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            ?.height) ||
        null,
      alt: (hasMedia && post._embedded["wp:featuredmedia"][0].alt_text) || null,
    },
    sticky: post.sticky,
    description: post.description,
  };
};

export interface WP_Page {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  _blocks: Block[];
  excerpt: { rendered: string };
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  blocks: MappedBlock[];
}

export const mapPage = (page: WP_Page): Page => ({
  id: page.id,
  slug: page.slug,
  title: page.title.rendered,
  content: page.content.rendered,
  excerpt: page.excerpt.rendered,
  blocks: page._blocks.map(mapBlock),
});
