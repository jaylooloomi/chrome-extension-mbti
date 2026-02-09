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

// This recursive function formats the nested bookmark structure into an indented text string.
const formatBookmarksToTextRecursive = (nodes: any[], indent = ""): string => {
  let text = "";
  for (const node of nodes) {
    text += `${indent}- ${node.title}\n`;
    if (node.children) {
      text += formatBookmarksToTextRecursive(node.children, indent + "  ");
    }
  }
  return text;
};

// This function cleans the raw bookmark data and then formats it into a text string.
export const formatBookmarksToText = (data: any[]): string => {
  const cleanedData = data.map(cleanBookmarkNode);
  return formatBookmarksToTextRecursive(cleanedData);
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

export const downloadBookmarksAsText = (textContent: string): string => {
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filename = `bookmarks_for_analysis_${new Date().toISOString().slice(0,10)}.txt`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return filename;
};
