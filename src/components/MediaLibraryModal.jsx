import React, { useState, useEffect } from 'react';
import { Image, Upload, Search, Trash2, Check, Copy, X, RefreshCw, Sparkles, FolderOpen } from 'lucide-react';

export default function MediaLibraryModal({
  isOpen = true,
  onClose,
  onSelectImage,
  isModal = true // If false, renders as full tab content
}) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Fetch media from backend
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  // Handle new upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const newItem = await res.json();
        setMediaList(prev => [newItem, ...prev]);
        setSelectedItem(newItem);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (item) => {
    if (!window.confirm(`Delete image "${item.name}" from library?`)) return;

    try {
      if (item.url?.startsWith('/uploads/')) {
        const filename = item.url.replace('/uploads/', '');
        await fetch(`/api/media/${filename}`, { method: 'DELETE' });
      }
      setMediaList(prev => prev.filter(m => m.id !== item.id && m.url !== item.url));
      if (selectedItem?.url === item.url) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredMedia = mediaList.filter(item => 
    !search.trim() || item.name?.toLowerCase().includes(search.toLowerCase()) || item.url?.toLowerCase().includes(search.toLowerCase())
  );

  const content = (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      {/* Top Header & Actions */}
      <div className="p-4 sm:p-5 border-b border-[#242424] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161616]">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="text-gold-400" size={20} />
            <h3 className="font-serif text-lg font-bold text-white">WordPress-Style Media Library</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Browse, upload and select from all uploaded product images and banners
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-grow sm:w-56">
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#333] text-xs text-white pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Upload Button */}
          <label className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow">
            <Upload size={14} />
            <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          <button
            onClick={fetchMedia}
            className="p-2 rounded-lg bg-[#202020] hover:bg-[#2c2c2c] text-zinc-400 hover:text-white transition"
            title="Refresh Media"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#202020] hover:bg-[#2c2c2c] text-zinc-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid & Preview Pane */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden min-h-[420px] max-h-[650px]">
        
        {/* Media Grid */}
        <div className="flex-grow p-4 overflow-y-auto">
          {loading && mediaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
              <RefreshCw size={24} className="animate-spin text-gold-400" />
              <p className="text-xs">Loading media files...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border-2 border-dashed border-[#242424] rounded-2xl">
              <Image size={40} className="text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300">No media files found</p>
              <p className="text-xs text-zinc-500 mt-1">Upload images using the button above</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filteredMedia.map((item) => {
                const isSelected = selectedItem?.url === item.url;
                return (
                  <div
                    key={item.id || item.url}
                    onClick={() => setSelectedItem(item)}
                    onDoubleClick={() => {
                      if (onSelectImage) {
                        onSelectImage(item.url);
                        if (onClose) onClose();
                      }
                    }}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all bg-[#0a0a0a] ${
                      isSelected
                        ? 'border-gold-400 ring-2 ring-gold-500/40 scale-[0.98]'
                        : 'border-[#242424] hover:border-zinc-500'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-gold-500 text-black flex items-center justify-center shadow-lg">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition truncate text-[10px] text-zinc-300">
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Selected Image Details */}
        <div className="w-full md:w-80 bg-[#141414] border-t md:border-t-0 md:border-l border-[#242424] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          {selectedItem ? (
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Attachment Details</h4>
              
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center p-2">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="truncate"><strong className="text-white">Name:</strong> {selectedItem.name}</div>
                {selectedItem.size > 0 && (
                  <div><strong className="text-white">File size:</strong> {(selectedItem.size / 1024).toFixed(1)} KB</div>
                )}
                <div>
                  <strong className="text-white block mb-1">Direct URL:</strong>
                  <div className="flex items-center gap-1.5 bg-[#0e0e0e] border border-[#262626] rounded px-2 py-1.5">
                    <input
                      type="text"
                      readOnly
                      value={selectedItem.url}
                      className="w-full bg-transparent text-[11px] text-zinc-400 truncate focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopy(selectedItem.url)}
                      className="text-zinc-400 hover:text-gold-300 shrink-0"
                      title="Copy URL"
                    >
                      {copiedUrl === selectedItem.url ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedItem)}
                  className="px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-10">
              <Image size={32} className="text-zinc-600 mb-2" />
              <p className="text-xs">Select an image to preview details</p>
            </div>
          )}

          {/* Bottom Action (For Modal mode) */}
          {isModal && onSelectImage && (
            <div className="pt-4 border-t border-[#242424] mt-4">
              <button
                type="button"
                disabled={!selectedItem}
                onClick={() => {
                  if (selectedItem) {
                    onSelectImage(selectedItem.url);
                    if (onClose) onClose();
                  }
                }}
                className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow ${
                  selectedItem
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black'
                    : 'bg-[#222] text-zinc-600 cursor-not-allowed'
                }`}
              >
                Insert Selected Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return (
      <div className="bg-[#121212] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
        {content}
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {content}
      </div>
    </div>
  );
}
