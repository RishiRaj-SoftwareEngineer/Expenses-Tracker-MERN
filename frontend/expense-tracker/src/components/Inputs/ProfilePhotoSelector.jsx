import React, { useEffect, useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return undefined;
    }

    if (typeof image === 'string') {
      setPreviewUrl(image);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const triggerFilePicker = () => {
    inputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="relative w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full">
          <LuUser className="text-4xl text-primary" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute bottom-1 right-1"
            onClick={triggerFilePicker}
            aria-label="Upload profile photo"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative w-20 h-20">
          <button
            type="button"
            className="w-20 h-20 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={triggerFilePicker}
            aria-label="Change profile photo"
          >
            <img
              src={previewUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute bottom-1 right-1"
            onClick={handleRemoveImage}
            aria-label="Remove profile photo"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
