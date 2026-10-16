/** The official website is independent of this Docker deployment. */
export const websiteUrl =
  import.meta.env.VITE_WEBSITE_URL || 'https://fearnot221.github.io/evergreenbloom/';
export const websiteHref = (path = '') =>
  `${websiteUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
