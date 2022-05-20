import { useCallback } from 'react';
import dayjs from 'dayjs';
// import asyncPool from 'tiny-async-pool';
import { saveFile } from '@/lib/firebase/storage';

import { pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import { TypedArray } from 'pdfjs-dist/types/src/display/api';

export const useUpload = (group?: string) => {
  const uploadPDF = useCallback(
    async (blob: Blob, filename: string, done: Function) => {
      const readFileData = (blob: Blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.onload = (e) => {
            // @ts-ignore
            resolve(new Uint8Array(e.target.result));
          };
          reader.onerror = (error) => reject(error);
        });
      };
      const convertPdfToImages = async (blob: Blob) => {
        // const blobs: Blob[] = [];
        const data = (await readFileData(blob)) as TypedArray;

        const pdf = await pdfjs.getDocument(data).promise;

        const canvas = document.createElement('canvas');
        let pages: number = pdf.numPages;
        if (pages > 20) {
          pages = 20;
        }
        const now = dayjs().unix();
        for (let i = 0; i < pages; i++) {
          const page = await pdf.getPage(i + 1);
          const viewport = page.getViewport({ scale: 1 });
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // @ts-ignore
          await page.render({
            // @ts-ignore
            canvasContext: context,
            viewport: viewport,
          }).promise;
          await new Promise((r) => {
            canvas.toBlob((blob) => {
              if (!blob) return;
              // blobs.push(blob);
              saveFile(
                blob,
                () => {},
                (path: string) => {
                  if (i === 0) {
                    console.log(path);
                    done(path);
                  }
                },
                `${filename}_${now}`,
                {
                  filename,
                  order: i + 1,
                  type: 'pdf',
                }
              );
              r(true);
            });
          });
        }
        canvas.remove();
        // return blobs;
      };
      // @ts-ignore
      await convertPdfToImages(blob);
      // await asyncPool(1, blobs, (blob: Blob) =>
      //   saveFile(
      //     blob,
      //     () => {},
      //     (path: string) => {
      //       //console.log(path);
      //     },
      //     filename
      //   )
      // );
    },
    []
  );

  const uploadImage = useCallback(
    async (
      blob: Blob,
      filename: string,
      progress: Function,
      done: Function
    ) => {
      await saveFile(
        blob,
        progress,
        (path: string) => {
          done(path);
        },
        group || filename
      );
    },
    [group]
  );

  return {
    uploadPDF,
    uploadImage,
  };
};
