import { Component, OnInit } from '@angular/core';
import { LoginService } from '@services/login.service';
import { IUser } from '@interfaces/loginInterface';
import { Languages } from '../../enums/languages.enum';
import { Router, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public language = Languages.English;
  public currentRoute: string;
  isMenuHide = true;
  user: IUser;
  constructor(private loginService: LoginService, private route: Router) {
    route.events
      .pipe(filter((event: Event): event is RouterEvent => event instanceof RouterEvent))
      .subscribe((event: RouterEvent) => {
        this.currentRoute = event.url;
      });
  }
  ngOnInit(): void {
    this.user = this.loginService.getUser();
  }
  public toggleMenu(): void {
    this.isMenuHide = !this.isMenuHide;
  }
  public checkRoute(): boolean {
    const checkRoutes: string[] = ['/home', '/add-bonus', '/history', '/bonuses', '/users'];
    return checkRoutes.includes(this.currentRoute);
  }
  public logout(): void {
    this.loginService.logout();
  }
}