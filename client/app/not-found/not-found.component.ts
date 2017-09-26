import { Component } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

  error: string;
  city: string;

  constructor(public activatedRoute: ActivatedRoute, public router: Router) { }
  ngOnInit() {
    this.error = this.activatedRoute.snapshot.queryParams['error'];
  }

  search() {
    this.router.navigate([this.city]);
  }

}
