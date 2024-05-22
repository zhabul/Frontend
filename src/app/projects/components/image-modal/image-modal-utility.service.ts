export class ImageModalUtility {
  getAlbumFiles(albums, content_id = null, type_id = null) {
    const keys = Object.keys(albums);
    const images_ = [];
    const pdfs_ = [];

    keys.forEach((key) => {
      const object = albums[key];
      const description = object.description;
      const images = this.prepareFiles(object.images, description, key);
      const pdfs = this.prepareFiles(object.pdfs, description, key);

      images.forEach((item: any) => {
        item["album"] = key;
        item["content_id"] = content_id ? content_id : item["content_id"];
        item["type_id"] = type_id ? type_id : item["content_id"];
        images_.push(item);
      });
      pdfs.forEach((item: any) => {
        item["album"] = key;
        item["content_id"] = content_id ? content_id : item["content_id"];
        item["type_id"] = type_id ? type_id : item["type_id"];
        pdfs_.push(item);
      });
    });

    return { images: images_, pdfs: pdfs_ };
  }

  prepareFiles(files, description, key) {
    const newFiles = files.map((file) => {
      file.album = key;
      file.description = description;
      file.Description = description;
      return file;
    });
    return newFiles;
  }

  clearFiles(albums, content_id = null, type_id = null){
    const keys = Object.keys(albums);

    keys.forEach((key) => {
      let object = albums[key];
      console.log(object)
      object.images = [];
      object.pdfs = [];
      object.description = "";
    });
  }
}
