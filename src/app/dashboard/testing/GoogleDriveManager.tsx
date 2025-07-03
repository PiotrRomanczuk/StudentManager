import { useState } from "react";
import {
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileVideo,
  FaFileAudio,
  FaFileCode,
} from "react-icons/fa";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  createdTime: string;
}

function getFileIcon(mimeType: string) {
  switch (true) {
    case /image\//.test(mimeType):
      return <FaFileImage className="text-blue-400" />;
    case /pdf$/.test(mimeType):
      return <FaFilePdf className="text-red-500" />;
    case /word/.test(mimeType):
      return <FaFileWord className="text-blue-700" />;
    case /excel/.test(mimeType):
      return <FaFileExcel className="text-green-600" />;
    case /powerpoint/.test(mimeType):
      return <FaFilePowerpoint className="text-orange-600" />;
    case /zip|rar|archive/.test(mimeType):
      return <FaFileArchive className="text-yellow-600" />;
    case /video/.test(mimeType):
      return <FaFileVideo className="text-purple-600" />;
    case /audio/.test(mimeType):
      return <FaFileAudio className="text-pink-600" />;
    case /code|javascript|typescript|python|json/.test(mimeType):
      return <FaFileCode className="text-gray-700" />;
    default:
      return <FaFileAlt className="text-gray-400" />;
  }
}

export default function GoogleDriveManager({
  initialFiles,
  initialError,
}: {initialFiles: DriveFile[]; initialError: string | null}) {
  const [files, setFiles] = useState<DriveFile[]>(initialFiles);
  const [error, setError] = useState<string | null>(initialError);

  // This function will be called by the parent component to refresh the file list
  const refreshFiles = async () => {
    const response = await fetch("/api/gdrive/files"); // Assuming a new API route to fetch files
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setFiles(data.files || []);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/gdrive/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      // Refresh the file list after successful upload
      await refreshFiles();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch("/api/gdrive/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: fileId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      // Refresh the file list after successful deletion
      await refreshFiles();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/gdrive/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      // Refresh the file list
      const { files, error } = await getDriveFiles();
      if (error) {
        setError(error);
      } else {
        setFiles(files || []);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">Google Drive Files</h2>
        <p className="text-red-500">Error: {error}</p>
        <p className="text-gray-400 mt-2">
          Try logging in again or check your connection.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Google Drive Files</h2>
        <input type="file" onChange={handleFileUpload} />
      </div>
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-4"
          >
            <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
            <div className="flex-1">
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(file.createdTime).toLocaleDateString()}
              </p>
            </div>
            <a
              href={file.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View
            </a>
            <button
              onClick={() => handleDeleteFile(file.id)}
              className="text-red-600 hover:text-red-800 font-semibold ml-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
