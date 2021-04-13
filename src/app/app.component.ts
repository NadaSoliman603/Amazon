import { Component } from '@angular/core';

import { IProduct } from './products/iproduct';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'myApp';
  storPosts: IProduct[]= [];
  onpostadd(post){
    this.storPosts.push(post)
  }
}
