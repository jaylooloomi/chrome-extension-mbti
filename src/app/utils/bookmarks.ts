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

const formatBookmarksToText = (nodes: any[], indent = ""): string => {
  let text = "";
  for (const node of nodes) {
    text += `${indent}- ${node.title}\n`;
    if (node.children) {
      text += formatBookmarksToText(node.children, indent + "  ");
    }
  }
  return text;
};

export const downloadBookmarksAsText = (data: any[]) => {
  const cleanedData = data.map(cleanBookmarkNode);
  //const textContent = formatBookmarksToText(cleanedData);
  const textContent = JSON.stringify(cleanedData)
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-t' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookmarks_for_analysis_${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
