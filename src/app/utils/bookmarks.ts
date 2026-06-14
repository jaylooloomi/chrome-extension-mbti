// Strip a Chrome bookmark tree down to titles + nested structure (no URLs),
// so only folder/page names are sent for analysis.
export const cleanBookmarkNode = (node: any) => {
  const cleanedNode: { title: string; children?: any[] } = { title: node.title };
  if (node.children && node.children.length > 0) {
    cleanedNode.children = node.children.map(cleanBookmarkNode);
  }
  return cleanedNode;
};
