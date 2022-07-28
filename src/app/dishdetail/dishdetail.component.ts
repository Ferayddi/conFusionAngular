import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import {Comment} from '../shared/comment';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next:string;
  commentForm: FormGroup;
  errMess: string;

  formErrors = {
    'author': '',
    'comment': ''
  }

  formErrorMessages = {
    'author':  {
      'required': 'This field is required',
      'minlength': 'the author field should at least be two characters long.'
    },
    'comment': {
      'required': 'This field is required'
    }

  }
  createCommentForm(): void {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: ['5'],
      comment: ['', Validators.required],
      date: ['']
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject ('BaseURL') private BaseURL) { 
      this.createCommentForm();
    }

  ngOnInit() {
    //let id = this.route.snapshot.params['id'];
    //this.dishService.getDish(id).subscribe((dish) => this.dish = dish );
    this.dishService.getDishIds().subscribe((dishIds: string[]) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
    errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }


// FINISH THE FOLLOWING:
  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.formErrorMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  newComment: Comment;
  onSubmit(){
    const d = new Date();
    let text = d.toISOString();
    this.newComment= this.commentForm.value;
    this.newComment.date = text;
    this.dish.comments.push(this.newComment);
    this.commentForm.reset({
      author: '',
      rating: '5',
      comment: '',
      date: ''
    });
    this.commentFormDirective.resetForm({
      author: '',
      rating: '5',
      comment: '',
      date: ''
    });

  }

}
