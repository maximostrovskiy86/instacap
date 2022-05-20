import CaptureImage from './CaptureImage';
import CaptureComment from './CaptureComment';

const CaptureInfo = () => {
  return (
    <div className="flex flex-row gap-3 h-full max-h-90% items-start sm:flex-col">
      {/* main capture content  */}
      <CaptureImage />
      {/* comment container */}
      <CaptureComment />
    </div>
  );
};

export default CaptureInfo;
