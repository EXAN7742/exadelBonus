import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { BonusesService } from '@services/bonuses.service';
import { MapEventsService } from '@services/map-events.service';
import { IOffice } from '@interfaces/office.interface';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'app-city-input',
  templateUrl: './city-input.component.html',
  styleUrls: ['./city-input.component.scss'],
})
export class CityInputComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public cities: string[];
  public cityInputControl = new FormControl();
  public filteredCity$: Observable<string[]>;
  @Output() changeCityEvent = new EventEmitter<string>();

  constructor(
    private bonusesService: BonusesService,
    private mapEventsService: MapEventsService,
    private locationService: LocationService,
  ) {}

  public ngOnInit(): void {
    this.chuseOfficeObserver();
    this.changeLocationObserver();
    this.getCities();
  }

  private chuseOfficeObserver(): void {
    this.subscription.add(
      this.mapEventsService.zoomToOfficeObserver().subscribe((office: IOffice) => {
        this.cityInputControl.setValue(office.city);
        this.changeCity();
      }),
    );
  }

  private changeLocationObserver(): void {
    this.subscription.add(
      this.locationService.changeLocationObserver().subscribe((city: string) => {
        this.cityInputControl.setValue(city);
        this.changeCity();
      }),
    );
  }

  private getCities(): void {
    this.subscription.add(
      this.bonusesService.getBonusesCities().subscribe((citiesList: string[]) => {
        this.cities = citiesList;
        this.filteredCity$ = this.cityInputControl.valueChanges.pipe(
          startWith(''),
          map((value) => this.searchFilter(value)),
        );
      }),
    );
  }

  private searchFilter(value: string): string[] {
    const filterValue = value.trim().toLocaleLowerCase();
    return this.cities.filter(
      (city: string) => city.toLocaleLowerCase().indexOf(filterValue) === 0,
    );
  }

  public changeCity(): void {
    const value = this.cityInputControl.value.trim();
    this.changeCityEvent.emit(value);
  }

  public reset(): void {
    this.cityInputControl.reset('');
    this.changeCity();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
