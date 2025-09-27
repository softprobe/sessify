// Helper function to generate a simple XPath for an element
export function getElementXPath(element: HTMLElement) {
  if (!element) return "";

  // @ts-ignore
  const idx = (sib: any, name?: any) =>
    sib ? idx(sib.previousElementSibling, name || sib.nodeName) + (sib.nodeName == name) : 1;
  // @ts-ignore
  const segs = (elm) =>
    !elm || elm.nodeType !== 1
      ? [""]
      : [...segs(elm.parentNode), `${elm.nodeName.toLowerCase()}[${idx(elm)}]`];
  return segs(element).join("/");
}
