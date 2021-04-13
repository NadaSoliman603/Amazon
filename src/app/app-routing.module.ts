import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreatComponent } from './products/product-creat/product-creat.component';
import { ProductListComponent } from './products/product-list/product-list.component';

const routes: Routes = [
  {path:"", component:ProductListComponent},
  {path:"creatProduct", component:ProductCreatComponent},
  {path:"editproduct/:productId", component:ProductCreatComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
