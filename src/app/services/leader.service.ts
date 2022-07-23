import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeader(id: string): Leader {
    return LEADERS.filter((lea) => (lea.id === id))[0]; //only one element, array[0]
  }

  getFeaturedLeader(): Leader {
    return LEADERS.filter((lea) => lea.featured)[0];
  }

  getLeaders(): Leader[] {
    return LEADERS;
  }

}
