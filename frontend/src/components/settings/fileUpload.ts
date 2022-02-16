import http from "../../http-common";


export function upload(file:any, onUploadProgress:any){
  let formData = new FormData();

  formData.append("file", file);

  return http.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

export function getFiles(){
  return http.get("/files");
};
