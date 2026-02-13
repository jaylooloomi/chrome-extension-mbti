// Bookmark filtering utility to exclude sensitive folders

export interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
}

export interface BookmarkFilterSettings {
  excludedFolderIds: string[];
}

const STORAGE_KEY = 'bookmarkFilterSettings';

/**
 * Get excluded folder IDs from storage
 */
export const getExcludedFolderIds = async (): Promise<string[]> => {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const settings: BookmarkFilterSettings = result[STORAGE_KEY] || { excludedFolderIds: [] };
    return settings.excludedFolderIds;
  } catch (error) {
    console.error('Error getting excluded folder IDs:', error);
    return [];
  }
};

/**
 * Save excluded folder IDs to storage
 */
export const saveExcludedFolderIds = async (folderIds: string[]): Promise<void> => {
  try {
    const settings: BookmarkFilterSettings = {
      excludedFolderIds: folderIds
    };
    await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  } catch (error) {
    console.error('Error saving excluded folder IDs:', error);
    throw error;
  }
};

/**
 * Recursively filter bookmarks, removing excluded folders and their children
 */
export const filterBookmarks = (
  nodes: BookmarkNode[],
  excludedIds: Set<string>
): BookmarkNode[] => {
  const filtered: BookmarkNode[] = [];

  for (const node of nodes) {
    // Skip if this node is in the exclusion list
    if (excludedIds.has(node.id)) {
      continue;
    }

    // Create a copy of the node
    const filteredNode: BookmarkNode = {
      id: node.id,
      title: node.title,
      ...(node.url && { url: node.url })
    };

    // Recursively filter children
    if (node.children && node.children.length > 0) {
      const filteredChildren = filterBookmarks(node.children, excludedIds);
      if (filteredChildren.length > 0) {
        filteredNode.children = filteredChildren;
      }
    }

    filtered.push(filteredNode);
  }

  return filtered;
};

/**
 * Apply bookmark filtering based on stored settings
 */
export const applyBookmarkFilter = async (bookmarks: BookmarkNode[]): Promise<BookmarkNode[]> => {
  const excludedIds = await getExcludedFolderIds();

  if (excludedIds.length === 0) {
    return bookmarks; // No filtering needed
  }

  const excludedSet = new Set(excludedIds);
  return filterBookmarks(bookmarks, excludedSet);
};

/**
 * Recursively get all bookmark folders for UI selection
 */
export const getAllBookmarkFolders = (nodes: BookmarkNode[]): BookmarkNode[] => {
  const folders: BookmarkNode[] = [];

  for (const node of nodes) {
    // A folder is a node with children (no URL)
    if (node.children) {
      folders.push({
        id: node.id,
        title: node.title,
        children: node.children
      });

      // Recursively get nested folders
      folders.push(...getAllBookmarkFolders(node.children));
    }
  }

  return folders;
};

/**
 * Count total bookmarks in a tree (excluding folders)
 */
export const countBookmarks = (nodes: BookmarkNode[]): number => {
  let count = 0;

  for (const node of nodes) {
    if (node.url) {
      count++; // This is a bookmark
    }
    if (node.children) {
      count += countBookmarks(node.children); // Recursively count children
    }
  }

  return count;
};

/**
 * Get folder path (breadcrumb) for display
 */
export const getFolderPath = (
  folderId: string,
  allNodes: BookmarkNode[],
  currentPath: string[] = []
): string[] | null => {
  for (const node of allNodes) {
    if (node.id === folderId) {
      return [...currentPath, node.title];
    }

    if (node.children) {
      const found = getFolderPath(folderId, node.children, [...currentPath, node.title]);
      if (found) {
        return found;
      }
    }
  }

  return null;
};
