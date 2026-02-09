// Mock data for demo purposes since we cannot access chrome.bookmarks in iframe

export const cleanBookmarkNode = (node: any) => {
  const cleanedNode: { title: string, children?: any[] } = {
    title: node.title,
  };

  if (node.children && node.children.length > 0) {
    cleanedNode.children = node.children.map(cleanBookmarkNode);
  }

  return cleanedNode;
};

export const downloadBookmarks = (data: any[]) => {
  const cleanedData = data.map(cleanBookmarkNode);
  const blob = new Blob([JSON.stringify(cleanedData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookmarks_structure_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
