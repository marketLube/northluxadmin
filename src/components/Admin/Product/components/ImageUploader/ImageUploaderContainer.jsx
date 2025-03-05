import ImageUploader from "./ImageUploader";
import ErrorMessage from "../../../../common/ErrorMessage";

const ImageUploaderContainer = ({
  images,
  handleClick,
  handleFileChange,
  fileInputs,
  error,
}) => (
  <div className="space-y-2">
    <div className="images w-full flex gap-2 px-3 rounded-lg">
      <div className="w-1/3">
        <ImageUploader
          index={0}
          image={images[0]}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          fileInputs={fileInputs}
        />
      </div>
      <div className="w-1/3">
        <ImageUploader
          index={1}
          image={images[1]}
          handleClick={handleClick}
          handleFileChange={handleFileChange}
          fileInputs={fileInputs}
        />
      </div>
      <div className="border w-1/3 h-52 flex flex-col gap-2">
        {[...Array(2)].map((_, index) => (
          <ImageUploader
            key={index}
            index={index + 2}
            image={images[index + 2]}
            handleClick={handleClick}
            handleFileChange={handleFileChange}
            fileInputs={fileInputs}
          />
        ))}
      </div>
    </div>
    <div className="px-3">
      <ErrorMessage error={error} />
    </div>
  </div>
);

export default ImageUploaderContainer;
