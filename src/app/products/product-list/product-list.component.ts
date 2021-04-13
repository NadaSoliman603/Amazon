import { Component, OnInit } from '@angular/core';
import { IProduct } from '../iproduct';
import { ProductService } from '../product.service';
import { PageEvent } from '@angular/material/paginator';
import { from, Subscription } from 'rxjs';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(public productService: ProductService) {

  }

  // products=[
  //   { title:' product 1', content:' product 2 content' },
  //   { title:'product 2', content:' product 2 content'}
  // ]


  // @Input() products:Iproduct[]=[]
  products:IProduct[]=[];
  isloading:boolean = false;
  totalproduct:number = 10;
  productParPage:number = 2;
  currentPage:number = 1;
  pageSizeOption = [1, 2, 5, 10];



  onChangePage(pageData: PageEvent){
    this.isloading = true
    this.currentPage = pageData.pageIndex +1;
    this.productParPage = pageData.pageSize;

    this.productService.getproduct(this.productParPage, this.currentPage).subscribe(

      data=>{
        this.totalproduct = data.maxproduct
        this.isloading = false
        this.products = data.product
        this.productService.allproduct(data)
      }
    )
  }

  deleteproduct(id: String){
    this.productService.deleteproduct(id)
      const updatedproduct = this.products.filter( (product)=> {return product._id !== id})
      this.products = updatedproduct;
  }
  private productSub:Subscription
  ngOnInit(): void {
    this.isloading = true
    this.productService.getproduct(this.productParPage, this.currentPage)
    .subscribe(
      data=>{
        console.log(data)
        this.isloading = false
        this.totalproduct = data.maxproduct
        this.products = data.product
        console.log(data.product)
        this.productService.allproduct(data)
      }
    )


  this.productSub =  this.productService.getproductUpdate()
    .subscribe((newproducts:IProduct[])=>{
      this.products = newproducts
    })

  }

  ngOnDestroy(): void {

    this.productSub.unsubscribe()
  }

}
