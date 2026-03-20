import React, { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useScreenshots } from '../hooks/useScreenshots';
import { screenshotApi } from '../api/endpoints';


export default function ScreenshotGallery({ hostname }) {
  const [screenshotList, setScreenshotList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  const { data: initialData, isLoading } = useScreenshots(hostname, 20);

  useEffect(() => {
    if (initialData) {
      const { screenshots: imgs, total } = initialData;
      setScreenshotList(imgs);
      setTotalCount(total);
      setOffset(20);
      setHasMore(imgs.length >= 20 && imgs.length < total);
    }
  }, [initialData]);

  const screenshots = screenshotList;
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const navigate = (direction) => {
    if (selectedIndex === null) return;
    const newIndex = selectedIndex + direction;
    if (newIndex >= 0 && newIndex < screenshots.length) {
      setSelectedIndex(newIndex);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const response = await screenshotApi.getByHostnameOffset(hostname, offset, 20);
      const data = Array.isArray(response) ? response : response.screenshots || [];
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setScreenshotList(prev => [...prev, ...data]);
        setOffset(prev => prev + 20);
        if (data.length < 20) setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!hostname) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        <Camera size={32} className="mx-auto mb-2 opacity-50" />
        <p>Select an employee to view screenshots</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        <p>Loading screenshots...</p>
      </div>
    );
  }

  if (screenshots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        <Camera size={32} className="mx-auto mb-2 opacity-50" />
        <p>No screenshots available</p>
        <p className="text-sm mt-1">Screenshots are captured every 10 minutes</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Camera size={20} />
        Screenshots ({screenshots.length}{totalCount > 0 && screenshots.length < totalCount && ` / ${totalCount}`})
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {screenshots.map((screenshot, index) => (
          <div
            key={screenshot._id || index}
            className="relative group cursor-pointer"
            onClick={() => openModal(index)}
          >
            <img
              src={screenshot.imageUrl}
              alt={`Screenshot ${index + 1}`}
              className=" object-cover rounded border hover:ring-2 hover:ring-blue-500"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b opacity-0 group-hover:opacity-100 transition-opacity">
              {new Date(screenshot.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2 mx-auto"
          >
            {loadingMore && <Loader2 size={16} className="animate-spin" />}
            Load More
          </button>
        </div>
      )}

      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={closeModal}>
          <button
            className="absolute left-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded"
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            disabled={selectedIndex === 0}
          >
            <ChevronLeft size={32} />
          </button>
          
          <img
            src={screenshots[selectedIndex]?.imageUrl}
            alt={`Screenshot ${selectedIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            className="absolute right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded"
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            disabled={selectedIndex === screenshots.length - 1}
          >
            <ChevronRight size={32} />
          </button>
          
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded"
            onClick={closeModal}
          >
            <X size={32} />
          </button>
          
          <div className="absolute bottom-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
            {new Date(screenshots[selectedIndex]?.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
