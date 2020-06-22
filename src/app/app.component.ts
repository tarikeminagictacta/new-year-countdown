import { Component } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  currentCount = 0;
  countdownStarted = false;
  countdownStatus = "Too early";

  private countdownTimer$ = new Observable<number>((observer: Observer<number>)=> {
    var counter = 10;
    observer.next(counter);

    var clearToken = setInterval(() => {
        observer.next(--counter);
        if (counter == 0) {
          clearInterval(clearToken);
          observer.complete();
        }
      }, 1000);

    return new Subscription(() => clearInterval(clearToken))
  });

  private subscription: Subscription;

  startCountdown() {
    this.countdownStarted = true;
    this.subscription = this.countdownTimer$
      .subscribe(
        counter => this.currentCount = counter, 
        err => {}, 
        () => {
          this.countdownStatus = "Happy New Year!";
          this.countdownStarted = false;
        });
  }

  stopCountdown() {
    this.countdownStarted = false;
    this.countdownStatus = "Countdown canceled";
    this.currentCount = 0;
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
