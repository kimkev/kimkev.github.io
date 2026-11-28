const SITE_URL = 'https://kimkev.github.io';

const upsertHeadElement = (selector, create) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
};

const setMeta = (attribute, name, content) => {
  const selector = `meta[${attribute}="${name}"]`;
  const element = upsertHeadElement(selector, () => {
    const meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    return meta;
  });
  element.setAttribute('content', content);
};

export const applyPageMeta = (pathname, page) => {
  const url = `${SITE_URL}${pathname}`;

  document.title = page.title;
  setMeta('name', 'description', page.description);
  setMeta('property', 'og:title', page.title);
  setMeta('property', 'og:description', page.description);
  setMeta('property', 'og:url', url);

  const canonical = upsertHeadElement('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });
  canonical.setAttribute('href', url);

  if (page.noindex) {
    setMeta('name', 'robots', 'noindex');
  } else {
    document.head.querySelector('meta[name="robots"]')?.remove();
  }
};
