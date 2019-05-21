import { Component, OnInit } from '@angular/core';
import { Observable, of, empty, fromEvent, from } from 'rxjs';
import { delay, switchMapTo, concatAll, count, scan, withLatestFrom, share} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'progressBarProject';

  ngOnInit(){
    
    const requestOne = of('first').pipe(delay(1000));
    const requestTwo = of('second').pipe(delay(2000));
    const requestThree = of('third').pipe(delay(3000));
    const requestFour = of('fourth').pipe(delay(1400));
    const requestFive = of('fifth').pipe(delay(1000));
    
    const loadButton = document.getElementById('load');
    const progressBar = document.getElementById('progress');
    const content = document.getElementById('data');
    
    
    const updateProgress = progressRatio => {
     
      progressBar.style.width = 100 * progressRatio + '%';
      if (progressRatio === 1) {
        progressBar.className += ' finished';
      }
    };
  
    const updateContent = newContent => {
      content.innerHTML += newContent;
    };
    
    const displayData = data => {
      updateContent(`<div class="content-item">${data}</div>`);
    };
    
  
    const observables: Array<Observable<any>> = [
      requestOne,
      requestTwo,
      requestThree,
      requestFour,
      requestFive
    ];
    
    const array$ = from(observables);
    const requests$ = array$.pipe(concatAll());
    const clicks$ = fromEvent(loadButton, 'click');
    
    const progress$ = clicks$.pipe(switchMapTo(requests$), share());
    
    const count$ = array$.pipe(count());
    
    const ratio$ = progress$.pipe(

      scan(current => current + 1, 0),

      withLatestFrom(count$, (current, count) => current / count)
    );
    
    clicks$.pipe(switchMapTo(ratio$)).subscribe(updateProgress);
    
    progress$.subscribe(displayData);
  }
}
