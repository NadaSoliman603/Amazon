
import { IProduct } from './iproduct';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http:HttpClient, private router: Router) { }
  private product:IProduct[] =[]

  private productupdated = new Subject
  _url = "http://localhost:9097/product/post/";
  _urlUpdate = "http://localhost:9097/product/post/"


  allproduct(data){
    this.product = data
  }

  getproduct(productParPage:number, currentPage:number): Observable <{product:IProduct[], maxproduct:number}>{
    const quaeryParams =`?pageSize=${productParPage}&page=${currentPage}`
    //return [...this.product]
    return this._http.get<{product:IProduct[], maxproduct:number}>(this._url+quaeryParams)

  }

  updateproduct(id:string, ProductName:string, productDiscription:string, image: File | string ){
    let productData:IProduct | FormData
    if(typeof(image === "object")){
      productData = new FormData()
      productData.append("_id",id)
      productData.append("ProductName",ProductName)
      productData.append("productDiscription",productDiscription)
      productData.append("image", image, ProductName )
    }else{
      const product:IProduct = {_id: id, ProductName:ProductName, productDiscription:productDiscription, imagePath: image}
    }
    this._http.put(this._urlUpdate+id, productData)
    .subscribe(result=>{
      const updateproduct = [...this.product];
      const product:IProduct = {_id: id, ProductName:ProductName, productDiscription:productDiscription, imagePath: image}
      const oldproductIndex = updateproduct.findIndex(p=> p._id === id);
      updateproduct[oldproductIndex] = product;
      this.product = updateproduct
      this.productupdated.next([...this.product])
      this.router.navigate(["/"])
    })

  }

  getproductToEdit(id:string){
    return this._http.get<IProduct>(this._url+id)
  }

  getproductUpdate(){
    return this.productupdated.asObservable()
  }
  deleteproduct(productId: String){
    this._http.delete( this._url+productId)
    .subscribe(()=>{
      // const updatedproduct = this.product.filter( (product)=> {return product._id !== productId})
      // this.product = updatedproduct;
    })
  }
  addproduct(ProductName:string , productDiscription:string, image:File){
    //const product:IProduct = { _id:null,ProductName:ProductName, productDiscription:productDiscription}
    const productData = new FormData()
    productData.append("ProductName",ProductName)
    productData.append("productDiscription",productDiscription)
    productData.append("image", image, ProductName )


    this._http.post<{message:string, product:IProduct}>(this._url, productData)
    .subscribe(resData=>{
      const product:IProduct = {_id: resData.product._id, ProductName:ProductName, productDiscription:productDiscription, imagePath:resData.product.imagePath}
      // console.log(this.product)
      // this.product.push(product)
      // this.productupdated.next([...this.product])
      this.router.navigate(["/"])
    })
  }
}
