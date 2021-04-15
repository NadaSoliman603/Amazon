import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../iproduct';
import { ProductService } from '../product.service';
import { mimeType } from './mime-type-validator';

@Component({
  selector: 'app-product-creat',
  templateUrl: './product-creat.component.html',
  styleUrls: ['./product-creat.component.css']
})
export class ProductCreatComponent implements OnInit {

  constructor(public productService: ProductService, public route:ActivatedRoute) { }
  enterproductDiscription = '';
  entertitle = "";
  product:IProduct;
  imgPreview;
  isloading:boolean = false;
  form:FormGroup
  private mode = "creat";
  private productId :string;

  // //@Output() productCreate = new EventEmitter<IProduct>();

  // onaSavproduct(){
  //   //this.enterproductDiscription = productInput.value;
  //   if(this.form.invalid){
  //     console.log("invalid")
  //     return;
  //   }
  //   if(this.form.valid){
  //     // const product: IProduct  = {
  //     //   ProductName: form.value.ProductName,
  //     //   productDiscription: form.value.productDiscription
  //     // }

  //     // this.productCreate.emit(product);
  //     this.isloading = true
  //     if(this.mode == "creat"){
  //       this.productService.addproduct(this.form.value.ProductName,this.form.value.productDiscription, this.form.value.image)
  //     }
  //     if(this.mode == "edit"){
  //       console.log(this.productId)
  //       this.productService.updateproduct(this.productId,this.form.value.ProductName,this.form.value.productDiscription, this.form.value.image)
  //     }

  //     this.form.reset()
  //   }
  //   }



    @Output() postCreate = new EventEmitter<IProduct>();

    onaSavproduct(){
      if(this.form.invalid){
        return;
      }
      if(this.form.valid){
        this.isloading = true
        if(this.mode == "creat"){
          this.productService.addproduct(this.form.value.ProductName,this.form.value.productDiscription, this.form.value.image)
        }
        if(this.mode == "edit"){
          this.productService.updateproduct(this.productId,this.form.value.ProductName,this.form.value.productDiscription, this.form.value.image)
        }

        this.form.reset()
      }
      }
    ///////////////////////////////////////////////////////////////////////////////////

    onImgePick(event: Event) {
      const file = (event.target as HTMLInputElement).files[0]
      this.form.patchValue({image: file});
      this.form.get("image").updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {

        this.imgPreview = reader.result;
      };
      reader.readAsDataURL(file)
      console.log(this.form);
      console.log(file);
    }


  ngOnInit(): void {



    //reactivForm
    this.form = new FormGroup({
      ProductName: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      productDiscription:  new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]}),
      productPrice: new FormControl(null,  {validators:[Validators.required]}),
      productRate: new FormControl(null,  {validators:[Validators.required]}),
      productDiscount: new FormControl(null,  {validators:[Validators.required]}),
      productCategory: new FormControl(null,  {validators:[Validators.required]}),
      productQuntity: new FormControl(null,  {validators:[Validators.required]}),
      productColor: new FormControl(null,  {validators:[Validators.required]}),

    })

    //Edit product
    this.route.paramMap.subscribe((param)=>{
      if(param.has("productId")){
        console.log("EditMode")
        this.mode = "edit"
        this.productId = param.get("productId");

        this.productService.getproductToEdit(this.productId ).subscribe(product=>{
          this.product = {
            _id:product._id,
            ProductName: product.ProductName,
            productDiscription: product.productDiscription,
            imagePath: product.imagePath,
          };
          console.log("singleProduct",this.product)
          this.form.setValue({"ProductName":this.product.ProductName,"productDiscription":this.product.productDiscription ,"image":this.product.imagePath})
        })
      }else{
        console.log("creatMode")
        this.mode = "creat";
        this.productId = null
      }
    })
  }

}
