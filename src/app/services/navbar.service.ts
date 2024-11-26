import { Injectable } from '@angular/core';
import { faL } from '@fortawesome/free-solid-svg-icons';
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

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  setIsAdmin(value: boolean) {
    this.isAdminSubject.next(value);
  }

  //   toggleSidebar() {
  //     this.menuOption
  //     // this.isSidebarOpen.next(!this.isSidebarOpen.value);
  //   }
}
