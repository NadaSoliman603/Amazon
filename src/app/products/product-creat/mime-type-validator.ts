import { Observable, Observer, of} from "rxjs";
import {AbstractControl} from "@angular/forms"

export const mimeType = (
  control:AbstractControl
  ):Promise<{[Key:string]:any}> | Observable<{[Key:string]:any}> => {
    if(typeof(control.value) === 'string'){
      return of(null)
    }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create((observer: Observer<{[Key:string]:any}>) =>{
    fileReader.addEventListener("loadend", () => {
      const arr =new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
      // console.log(arr[0])
      let header = "";
      var isValid;
      for(let i=0; i < arr.length; i++){
        //console.log(arr[i])
        header += arr[i].toString(16)
      }

      switch (header) {
        case "89504e47":
          isValid =true;
            break;
        // case "47494638":
        //   isValid =true;
        //     break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid =true;
            break;
        default:
          isValid =false;; // Or you can use the blob.type as fallback
            break;
    }

    if (isValid){
      observer.next(null)
    }else{
      observer.next({inValidMimeType:true})
    }
    observer.complete()
    })
    fileReader.readAsArrayBuffer(file)
  })
  return frObs;
}
