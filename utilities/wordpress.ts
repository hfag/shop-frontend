export interface WP_Post {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  author: number;
  featured_media: number;
  sticky: boolean;
  description: string;
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
  id: number;
  slug: string;
  title: string;
  content: string;
  thumbnail: {
    url: string | null;
    width: number | null;
    height: number | null;
    alt: string | null;
  };
  sticky: boolean;
  description: string;
}

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
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    content: post.content.rendered,
    thumbnail: {
      url:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            .source_url) ||
        null,
      width:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            .width) ||
        null,
      height:
        (hasThumbnail &&
          post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail
            .height) ||
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
  excerpt: { rendered: string };
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
}

export const mapPage = (page: WP_Page): Page => ({
  id: page.id,
  slug: page.slug,
  title: page.title.rendered,
  content: page.content.rendered,
  excerpt: page.excerpt.rendered,
});
