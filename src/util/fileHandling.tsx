export const addNewFiles = (fileList: FileList|undefined, newFiles: FileList) => {
  const dataTransfer = new DataTransfer();

  // Append existing files
  if (fileList){
    for (let i = 0; i < fileList.length; i++) {
        dataTransfer.items.add(fileList[i]);
    }
  }
  

  // Add the new files
  for (let i = 0; i < newFiles.length; i++) {
      dataTransfer.items.add(newFiles[i]);
  }

  // Return the new FileList
  return dataTransfer.files;
}

export const addFileAtIndex = (fileList: FileList|undefined, newFiles: FileList, index: number) => {
  const dataTransfer = new DataTransfer();

  // Append existing files
  if (fileList){
    for (let i = 0; i < fileList.length; i++) {
      if (i !== index){
        dataTransfer.items.add(fileList[i]);
      }
      else {
        dataTransfer.items.add(newFiles[0]);
      }
    }
  }

  // Return the new FileList
  return dataTransfer.files;
}

export const removeFileAtIndex = (fileList: FileList|undefined, index: number) => {
  const dataTransfer = new DataTransfer();

  // remove file at index
  if (fileList){
    for (let i = 0; i < fileList.length; i++) {
      if (i !== index){
        dataTransfer.items.add(fileList[i]);
      }
    }
  }

  // Return the new FileList
  return dataTransfer.files;
}

export const convertFileToFileList = (file: File | undefined) => {
  if (!file){
    return new DataTransfer().files
  }
  const dt = new DataTransfer()
  dt.items.add(file)
  return dt.files
}