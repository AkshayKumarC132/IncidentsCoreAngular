import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  //   private isSidebarOpen = new BehaviorSubject<boolean>(false);
  //   isSidebarOpen$ = this.isSidebarOpen.asObservable();
  menuOption: any = 'top';

  private navbarPosition = new BehaviorSubject<string>('top'); // Default position
  navbarPosition$ = this.navbarPosition.asObservable();

  setNavbarPosition(position: 'top' | 'left') {
    this.navbarPosition.next(position);
  }

  private themeSubject = new BehaviorSubject<string>('light'); // Default theme is 'light'
  theme$ = this.themeSubject.asObservable();

  setTheme(theme: string) {
    this.themeSubject.next(theme);
  }

  //   toggleSidebar() {
  //     this.menuOption
  //     // this.isSidebarOpen.next(!this.isSidebarOpen.value);
  //   }
}
