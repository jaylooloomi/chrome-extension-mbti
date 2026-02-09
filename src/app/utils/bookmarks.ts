// Mock data for demo purposes since we cannot access chrome.bookmarks in iframe
export const generateMockBookmarks = () => {
  return [
    {
      id: "1",
      title: "Bookmarks Bar",
      children: [
        {
          id: "2",
          title: "Dev Resources",
          children: [
            { title: "React Documentation", url: "https://react.dev" },
            { title: "Tailwind CSS", url: "https://tailwindcss.com" },
            { title: "Stack Overflow", url: "https://stackoverflow.com" },
            { title: "GitHub - My Projects", url: "https://github.com" }
          ]
        },
        {
          id: "3",
          title: "Inspiration",
          children: [
            { title: "Pinterest - Cyberpunk", url: "https://pinterest.com" },
            { title: "Dribbble", url: "https://dribbble.com" },
            { title: "Behance", url: "https://behance.net" }
          ]
        },
        {
          id: "4",
          title: "Learning",
          children: [
            { title: "Coursera - AI Basics", url: "https://coursera.org" },
            { title: "Youtube - Psychology", url: "https://youtube.com" }
          ]
        },
        { title: "Gmail", url: "https://gmail.com" },
        { title: "Calendar", url: "https://calendar.google.com" }
      ]
    },
    {
      id: "5",
      title: "Other Bookmarks",
      children: [
        { title: "Recipes", children: [{ title: "Pizza", url: "..." }] },
        { title: "Travel", children: [{ title: "Japan Trip", url: "..." }] }
      ]
    }
  ];
};

export const downloadBookmarks = (data: any) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookmarks_structure_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
