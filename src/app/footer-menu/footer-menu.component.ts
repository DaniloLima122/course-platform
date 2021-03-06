import { Component, Renderer2, ElementRef, OnInit, OnChanges } from '@angular/core';
import { faBullhorn, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { ToggleFooterService } from '../services/toggle-footer.service';
import { Course } from '../course';
import { of } from 'rxjs';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-footer-menu',
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.css']
})
export class FooterMenuComponent implements OnInit{

  speaker = faBullhorn;
  folder = faFolderOpen;
  footerClass = of("isHidden");
  selectedCount = 0;
  selectAll = false;


  constructor(private render: Renderer2, private elementRef: ElementRef<any>, private toogleFooterService: ToggleFooterService, private coursesService: CoursesService) {
  }

  ngOnInit() {
    this.getSelectedCount()
    this.toggleFooter();
    this.isSelectedAll()
    this.render.setStyle(this.elementRef.nativeElement, 'display', 'none');
  }

  isSelectedAll(){
    this.toogleFooterService
    .isAllSelected()
    .subscribe(isAllS => {
      this.selectAll = isAllS
    })

  }


  toggleFooter() {

    this.toogleFooterService
      .getSelectedCount()
      .subscribe(
        (count: number) => {

          if (count > 0) {

            this.render.setStyle(this.elementRef.nativeElement, 'display', 'flex');
            this.footerClass = of("isShown");

          } else {

            this.footerClass = of("isHidden");
          }
        }
      )
  }

  getSelectedCount() {

    this.toogleFooterService
      .getSelectedCount()
      .subscribe(
        count => {
          this.selectedCount = count
        }
      )
  }

  selectAllCourses() {

    this.selectAll = !this.selectAll

    if (this.selectAll) {

      let courses: Course[] = []

      this.coursesService
        .getCourses()
        .subscribe((crs: Course[]) => {
          courses = crs;
        })

      this.toogleFooterService.storeAllCourses(courses);

    } else {

      this.toogleFooterService.removeAllCourses();
    }
  }
}
