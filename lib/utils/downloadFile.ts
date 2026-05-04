import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadAllFiles = async (urls: string[], folderName: string) => {
  const zip = new JSZip();
  const folder = zip.folder(folderName);

  const downloadPromises = urls.map(async (url, index) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const extension = url.split(".").pop()?.split(/\#|\?/)[0] || "jpg";
    folder?.file(`file_${index + 1}.${extension}`, blob);
  });

  await Promise.all(downloadPromises);
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${folderName}.zip`);
};
