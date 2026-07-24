import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Edit2,
  Trash2,
  X,
  File,
  Image as ImageIcon,
  Check,
  Paperclip,
  RefreshCw,
  Eye,
  FolderOpen,
} from 'lucide-react';
import { fileStorageService } from '../../services/fileStorageService';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * File Explorer Modal Component.
 * 
 * WHY THIS COMPONENT EXISTS:
 * Provides enterprise file management controls (upload, preview lightbox, rename, replace, download, delete)
 * for project documents and task attachments.
 */
export const FileExplorerModal = ({ isOpen, onClose, targetType, targetId, title = 'File Management' }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Active Selections
  const [previewFile, setPreviewFile] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [replaceTarget, setReplaceTarget] = useState(null);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const list = await fileStorageService.getFiles(targetType, targetId);
      setFiles(list || []);
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && targetType && targetId) {
      loadFiles();
    }
  }, [isOpen, targetType, targetId]);

  if (!isOpen) return null;

  // Upload File Selection
  const handleUploadSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await fileStorageService.uploadFile({
          targetType,
          targetId,
          fileName: file.name,
          fileType: file.type,
          fileData: reader.result,
        });
        showSuccess(`Uploaded ${file.name}`);
        loadFiles();
      } catch (err) {
        showError('Failed to upload file.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Replace File Selection
  const handleReplaceSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !replaceTarget) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await fileStorageService.replaceFile(replaceTarget.id, reader.result);
        showSuccess(`Replaced ${replaceTarget.fileName}`);
        setReplaceTarget(null);
        loadFiles();
      } catch (err) {
        showError('Failed to replace file.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Rename File
  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!newFileName.trim() || !renameTarget) return;
    try {
      await fileStorageService.renameFile(renameTarget.id, newFileName.trim());
      showSuccess('File renamed.');
      setRenameTarget(null);
      setNewFileName('');
      loadFiles();
    } catch (err) {
      showError('Failed to rename file.');
    }
  };

  // Delete File
  const handleDelete = async (fileId) => {
    try {
      await fileStorageService.deleteFile(fileId);
      showSuccess('File deleted.');
      loadFiles();
    } catch (err) {
      showError('Failed to delete file.');
    }
  };

  // Download File Stream
  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.fileData;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showInfo(`Downloading ${file.fileName}`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">{title}</h3>
              <p className="text-xs text-slate-400">Upload, preview, download, and manage document attachments</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Action Toolbar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Attached Documents ({files.length})</span>
          <label className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
            <input type="file" onChange={handleUploadSelect} className="hidden" />
          </label>
        </div>

        {/* Files Grid Viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner label="Loading attachments..." />
            </div>
          ) : files.length === 0 ? (
            <div className="py-12 text-center bg-slate-950/40 rounded-2xl border border-slate-800 p-6 space-y-2">
              <Paperclip className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
              <h4 className="text-sm font-bold text-slate-200">No attachments found</h4>
              <p className="text-xs text-slate-400">Click the upload button above to add documents, images, or assets.</p>
            </div>
          ) : (
            files.map((f) => {
              const isImage = f.fileType?.startsWith('image/');
              return (
                <div
                  key={f.id}
                  className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                      {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200 truncate">{f.fileName}</div>
                      <div className="text-[10px] text-slate-500">
                        {f.fileSize} • Uploaded by {f.uploadedByName} • {f.timeFormatted}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    {isImage && (
                      <button
                        onClick={() => setPreviewFile(f)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(f)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setRenameTarget(f);
                        setNewFileName(f.fileName);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <label
                      onClick={() => setReplaceTarget(f)}
                      className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                      title="Replace"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <input type="file" onChange={handleReplaceSelect} className="hidden" />
                    </label>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rename Modal Overlay Sub-Dialog */}
        {renameTarget && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between animate-in fade-in">
            <form onSubmit={handleRenameSubmit} className="flex items-center space-x-2 w-full">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Image Preview Lightbox Overlay Sub-Dialog */}
        {previewFile && (
          <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-200">
                <span>{previewFile.fileName}</span>
                <button onClick={() => setPreviewFile(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img
                src={previewFile.fileData}
                alt={previewFile.fileName}
                className="max-h-[70vh] rounded-2xl object-contain mx-auto border border-slate-800"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorerModal;
