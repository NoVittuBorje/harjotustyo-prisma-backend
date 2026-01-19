import  { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import useUploadImage from "../hooks/useUploadImage";
const FileUpload = ({ userid, setImagePath,type }) => {
  const [mutate] = useUploadImage();
  const onDrop = useCallback(
    (acceptedFiles) => {
      // do something here

      const variables = {
        userId: userid,
        type:type,
        file: acceptedFiles,
      };
      const handleupload = async (variables) => {
        const data = await mutate(variables);
        setImagePath(data.data.singleUpload);
      };
      handleupload(variables);
    },
    [mutate, setImagePath, userid,type]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive && "isActive"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <button>
          click to select image or drop here
          </button>
        )}
      </div>
    </>
  );
};
export default FileUpload;
