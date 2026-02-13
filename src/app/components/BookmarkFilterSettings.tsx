import React, { useState, useEffect } from 'react';
import {
  getExcludedFolderIds,
  saveExcludedFolderIds,
  getAllBookmarkFolders,
  countBookmarks,
  type BookmarkNode
} from '../utils/bookmarkFilter';

interface BookmarkFilterSettingsProps {
  bookmarks: BookmarkNode[];
}

export const BookmarkFilterSettings: React.FC<BookmarkFilterSettingsProps> = ({ bookmarks }) => {
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [allFolders, setAllFolders] = useState<BookmarkNode[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Load current settings
    const loadSettings = async () => {
      try {
        const ids = await getExcludedFolderIds();
        setExcludedIds(ids);

        const folders = getAllBookmarkFolders(bookmarks);
        setAllFolders(folders);
      } catch (error) {
        console.error('Error loading bookmark filter settings:', error);
      }
    };

    loadSettings();
  }, [bookmarks]);

  const handleToggleFolder = (folderId: string) => {
    setExcludedIds(prev => {
      if (prev.includes(folderId)) {
        return prev.filter(id => id !== folderId);
      } else {
        return [...prev, folderId];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await saveExcludedFolderIds(excludedIds);
      setMessage({ type: 'success', text: 'Bookmark filter settings saved successfully!' });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving bookmark filter settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const renderFolderItem = (folder: BookmarkNode, depth: number = 0) => {
    const isExcluded = excludedIds.includes(folder.id);
    const bookmarkCount = folder.children ? countBookmarks(folder.children) : 0;

    return (
      <div key={folder.id} style={{ marginLeft: `${depth * 20}px` }} className="folder-item">
        <label className="folder-checkbox">
          <input
            type="checkbox"
            checked={isExcluded}
            onChange={() => handleToggleFolder(folder.id)}
            className="mr-2"
          />
          <span className="folder-title">
            📁 {folder.title}
            <span className="folder-count text-gray-500 text-sm ml-2">
              ({bookmarkCount} bookmarks)
            </span>
          </span>
        </label>
      </div>
    );
  };

  return (
    <div className="bookmark-filter-settings p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Bookmark Folder Filtering</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select folders to exclude from AI analysis. Excluded folders and their bookmarks will not be sent to the AI.
      </p>

      <div className="folders-list max-h-96 overflow-y-auto border rounded p-3 mb-4 bg-gray-50">
        {allFolders.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookmark folders found.</p>
        ) : (
          allFolders
            .filter(folder => !folder.children || !allFolders.some(f => f.children?.some(c => c.id === folder.id)))
            .map(folder => renderFolderItem(folder, 0))
        )}
      </div>

      <div className="settings-footer flex items-center justify-between">
        <div className="info text-sm text-gray-600">
          {excludedIds.length === 0 ? (
            <span>No folders excluded</span>
          ) : (
            <span className="text-orange-600 font-medium">
              {excludedIds.length} folder{excludedIds.length > 1 ? 's' : ''} excluded
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 p-3 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <style>{`
        .folder-item {
          padding: 6px 0;
        }
        .folder-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .folder-checkbox:hover {
          background-color: #f3f4f6;
          border-radius: 4px;
          padding: 2px 4px;
        }
        .folder-title {
          user-select: none;
        }
      `}</style>
    </div>
  );
};
