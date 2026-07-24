import React, { useState } from 'react';
import { Paperclip, Upload, Download, Trash2, FileText, Image, FileSpreadsheet } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { projectDetailsService } from '../../services/projectDetailsService';

export const ProjectFilesSection = () => {
  const { showSuccess } = useToast();
  const [files, setFiles] = useState(() => projectDetailsService.getFiles());

  const handleUpload = () => {
    const newFile = {
      id: 'f-' + Date.now(),
      name: 'FlowForge_Architecture_Blueprint_2026.pdf',
      size: '3.1 MB',
      type: 'PDF',
      uploadedAt: 'Just now',
    };
    setFiles([newFile, ...files]);
    showSuccess('File "FlowForge_Architecture_Blueprint_2026.pdf" uploaded successfully.');
  };

  const handleDownload = (file) => {
    showSuccess(`Downloading "${file.name}"...`);
  };

  const handleDelete = (fileId) => {
    setFiles(files.filter((f) => f.id !== fileId));
    showSuccess('File removed from project attachments.');
  };

  const fileIcons = {
    PDF: FileText,
    Image: Image,
    Spreadsheet: FileSpreadsheet,
    JSON: FileText,
  };

  return (
    <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-500/10 rounded-xl text-brand-400 border border-brand-500/20">
            <Paperclip className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Project Attachments & Documents</h3>
            <p className="text-xs text-slate-400">Specifications, diagrams, and sprint reports</p>
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="px-3.5 py-2 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      <div className="space-y-3">
        {files.map((file) => {
          const FileIconComponent = fileIcons[file.type] || FileText;
          return (
            <div
              key={file.id}
              className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all duration-200"
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div className="p-2.5 bg-slate-900 border border-slate-800 text-brand-400 rounded-lg shrink-0">
                  <FileIconComponent className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="text-xs font-bold text-slate-200 truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-500 space-x-2">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Uploaded {file.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
