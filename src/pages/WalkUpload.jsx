import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";

function WalkUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Download Excel
  const downloadExcel = () => {
    const data = [
      {
        Name: "Ajay",
        Phone: "9761407482",
        City: "Noida",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "Excel_Format.xlsx");
  };

  // ✅ File Change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadProgress(0);
  };

  // ✅ Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);

      await axios.post(
        "https://api.almonkdigital.in/api/admin/import-excel",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      alert("Upload Successful!");
    } catch (err) {
      console.error(err);
      alert("Upload Failed!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
        
        <h4 className="text-center mb-3">Excel Upload</h4>
        <p className="text-muted text-center">
          Download format and upload your Excel file
        </p>

        {/* Download Button */}
        <button className="btn btn-outline-primary w-100 mb-3" onClick={downloadExcel}>
          ⬇ Download Excel Format
        </button>

        {/* File Input */}
        <input
          type="file"
          className="form-control mb-3"
          onChange={handleFileChange}
          accept=".xlsx, .xls"
        />

        {/* File Name */}
        {selectedFile && (
          <div className="alert alert-success py-2">
            📄 {selectedFile.name}
          </div>
        )}

        {/* Upload Button */}
        <button
          className="btn btn-success w-100"
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </button>

        {/* Progress */}
        {isUploading && (
          <div className="mt-3">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalkUpload;