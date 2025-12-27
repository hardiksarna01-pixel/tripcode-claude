import React, { useState, useRef, forwardRef } from 'react';
import { Upload, File, Image, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

/**
 * FileUpload Component
 * Drag and drop file upload with preview
 */
const FileUpload = forwardRef(({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  onChange,
  onError,
  value = [],
  label,
  helperText,
  error,
  disabled = false,
  showPreview = true,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const inputRef = useRef(null);

  // Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Validate file
  const validateFile = (file) => {
    const errors = [];

    // Check size
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${formatSize(maxSize)}`);
    }

    // Check type
    if (accept) {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const fileType = file.type;
      const fileExt = `.${file.name.split('.').pop().toLowerCase()}`;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExt === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', '/'));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        errors.push('File type not accepted');
      }
    }

    return errors;
  };

  // Handle files
  const handleFiles = (files) => {
    const fileList = Array.from(files);
    const validFiles = [];
    const errors = [];

    // Check max files
    if (!multiple && fileList.length > 1) {
      fileList.length = 1;
    }

    if (multiple && value.length + fileList.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    fileList.forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        errors.push({ file: file.name, errors: fileErrors });
      } else {
        validFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        });
      }
    });

    if (errors.length > 0) {
      onError?.(errors);
    }

    if (validFiles.length > 0) {
      if (multiple) {
        onChange?.([...value, ...validFiles]);
      } else {
        onChange?.(validFiles);
      }
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Remove file
  const handleRemove = (fileId) => {
    const file = value.find((f) => f.id === fileId);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    onChange?.(value.filter((f) => f.id !== fileId));
  };

  // Get file icon
  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return Image;
    return File;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <div className={`
            p-4 rounded-full mb-4
            ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>

          <p className="text-sm font-medium text-gray-700">
            {isDragging ? (
              'Drop files here'
            ) : (
              <>
                <span className="text-blue-600">Click to upload</span> or drag and drop
              </>
            )}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {accept || 'Any file type'} up to {formatSize(maxSize)}
          </p>
        </div>
      </div>

      {/* Helper text / Error */}
      {(helperText || error) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}

      {/* File list */}
      {showPreview && value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((item) => {
            const FileIcon = getFileIcon(item.type);
            const progress = uploadProgress[item.id];

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Preview or icon */}
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg">
                    <FileIcon className="w-6 h-6 text-gray-500" />
                  </div>
                )}

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatSize(item.size)}
                  </p>

                  {/* Progress bar */}
                  {progress !== undefined && progress < 100 && (
                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status / Remove */}
                <div className="flex-shrink-0">
                  {progress !== undefined ? (
                    progress < 100 ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                      className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

/**
 * ImageUpload Component
 * Specialized image upload with aspect ratio
 */
export const ImageUpload = forwardRef(({
  value,
  onChange,
  aspectRatio = '1/1',
  placeholder = 'Upload image',
  label,
  error,
  helperText,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      onChange?.({ file, preview });
    }
  };

  const handleRemove = () => {
    if (value?.preview) {
      URL.revokeObjectURL(value.preview);
    }
    onChange?.(null);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div
        className={`
          relative overflow-hidden rounded-xl border-2 border-dashed
          transition-colors duration-200
          ${error ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{ aspectRatio }}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {value?.preview ? (
          <>
            <img
              src={value.preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white text-gray-600 shadow"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Image className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{placeholder}</p>
          </div>
        )}
      </div>

      {(helperText || error) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

/**
 * AvatarUpload Component
 * Circular avatar upload
 */
export const AvatarUpload = forwardRef(({
  value,
  onChange,
  size = 'lg',
  label,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const inputRef = useRef(null);

  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      onChange?.({ file, preview });
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`
          relative ${sizes[size]} rounded-full overflow-hidden
          bg-gray-100 border-2 border-dashed border-gray-300
          hover:border-gray-400 transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {value?.preview ? (
          <img
            src={value.preview}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {label && (
        <span className="mt-2 text-sm text-gray-600">{label}</span>
      )}
    </div>
  );
});

AvatarUpload.displayName = 'AvatarUpload';

export default FileUpload;
