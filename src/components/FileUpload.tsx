import { FC } from 'react';
import type { ProcessServerConfigFunction } from 'filepond';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const FileUpload: FC<{ process: ProcessServerConfigFunction }> = ({
  process,
}) => {
  return (
    <FilePond
      labelFileProcessingError={(err) => {
        return err.body;
      }}
      instantUpload={true}
      allowRevert={false}
      oninit={() => {
        const el = document.querySelector(
          'a.filepond--credits'
        ) as HTMLAnchorElement;
        el.hidden = true;
      }}
      server={{ process }}
      name="files"
      labelIdle={`Paste, Drag or  <span class="filepond--label-action">Browse</span> <br>image or pdf`}    
    />
  );
};

export default FileUpload;
