import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CourseData, CourseService} from './course.service';
import {LessonData, LessonService} from '../service/lesson.service';
import {ActivatedRoute} from '@angular/router';
import {TestData, TestService} from '../service/test.service';
import {StepSwitcherService} from '../step-switcher.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {Meta, Title} from '@angular/platform-browser';
import {appUiUrl} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {UserData} from '../auth/user.data';
import {Listable} from '../listable';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit, OnDestroy {
  private courseService: CourseService;
  private lessonService: LessonService;
  private route: ActivatedRoute;
  currentCourse: CourseData;
  stepSwitcher: StepSwitcherService;

  private cd: ChangeDetectorRef;
  private _testService: TestService;
  spinnerVisible: boolean = true;
  schema: any;

  sticky;
  private stepId: number;
  isOwner = false;
  currentTest: TestData;
  currentLesson: LessonData;

  constructor(courseService: CourseService, lessonService: LessonService, route: ActivatedRoute,
              cd: ChangeDetectorRef,
              testService: TestService,
              private mediaMatcher: MediaMatcher,
              private meta: Meta, private titleService: Title,
              private authService: AuthService) {
    this.cd = cd;
    this.courseService = courseService;
    this.lessonService = lessonService;
    this.route = route;
    this._testService = testService;
  }

  ngOnInit() {


    this.route.paramMap.pipe(map(map => map.get('stepId'))).subscribe(stepId => {
      this.stepId = Number(stepId);
      this.tryToUpdate();
    });
    let id: number = Number(this.route.snapshot.paramMap.get('id'));
    let key = this.route.snapshot.queryParamMap.get('key');
    this.stepSwitcher = new StepSwitcherService(this.lessonService, this._testService);

    this.courseService.getCourseById(id, key).subscribe(course => {
      /*this.courseService.getCompletionStatus(course.id)
        .subscribe(completion => {
          course.completion = completion;
        });*/
      this.authService.getUserInfo().subscribe(user => {
        this.checkIsOwner(user);
      });

      this.titleService.setTitle('LessonsBox: ' + course.name);
      this.meta.updateTag({
        name: 'description',
        content: course.description
      });
      this.schema = {
        '@type': 'Course',
        url: appUiUrl + '/courses/' + this.courseService.constructCourseUrlFromDto(course),
        description: course.description,
        name: course.name
      };
      this.currentCourse = course;
      this.stepSwitcher.lessonsOfTheCourse = course.lessons;
      this.stepSwitcher.testsOfTheCourse = course.tests;

      this.tryToUpdate();
    });
  }

  ngAfterViewInit() {

    if (this.tryToUpdate()) {
      this.cd.detectChanges();
    }

    let sidenav = document.getElementById('sidenavStep');
    let menu = document.getElementById('mainMenu');
    let toggleBtn = document.getElementById('toggleBtn');
    this.sticky = function myFunction() {
      if (window.pageYOffset >= menu.offsetHeight) {
        if (toggleBtn != null) {
          toggleBtn.classList.add('sticky');
        }
        sidenav.classList.add('sticky');
      } else {
        if (toggleBtn != null) {
          toggleBtn.classList.remove('sticky');
        }
        sidenav.classList.remove('sticky');
      }
    };
    window.addEventListener('scroll', this.sticky);


  }

  private tryToUpdate(): boolean {
    this.currentTest = null;
    this.currentLesson = null;
    this.spinnerVisible = true;
    if (this.stepSwitcher != null && this.stepSwitcher.ordered != null && this.stepSwitcher.ordered.length != 0) {
      let ordered = this.stepSwitcher.ordered;
      if (this.stepId != null) {
        let step = ordered.find(step => step.getOrder() == this.stepId);
        if (step != null) {
          this.stepSwitcher.switchTo(step).subscribe(listable => {
            this.spinnerVisible = false;
            this.updateCurrentData(listable);
          });
          return true;
        }
      }
      this.stepSwitcher.switchTo(ordered[0]).subscribe(listable => {
        this.spinnerVisible = false;
        this.updateCurrentData(listable);
      });
      return true;
    }
    return false;
  }


  private updateCurrentData(listable: Listable) {
    let schema = {
      '@type': 'Course',
      name: this.currentCourse.name,
      url: null,
    };
    schema.url = appUiUrl + '/courses/' + this.courseService.constructCourseUrlFromDto(this.currentCourse) + '/steps/' + this.courseService.constructCourseUrl(listable.getName(), listable.getOrder());
    if (listable instanceof TestData) {
      this.currentTest = listable as TestData;
      schema.name = 'Test with the instruction: ' + this.currentTest.instruction;
      this.currentLesson = null;
    } else if (listable instanceof LessonData) {
      this.currentTest = null;
      this.currentLesson = listable as LessonData;
      schema.name = 'This lesson is about: ' + this.currentLesson.getName();
    }
    this.schema = schema;
  }

  /*  @HostListener('window:scroll', []) onWindowScroll() {
        this.scrollFunction();
        /!*if
        }*!/
      }*/

  // When the user scrolls down 20px from the top of the document, show the button
  scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      document.getElementById('upBtn').style.display = 'block';
    } else {
      document.getElementById('upBtn').style.display = 'none';
    }
  }

// When the user clicks on the button, scroll to the top of the document

  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  sidenavmode(): boolean {
    if (this.mediaMatcher.matchMedia('(max-width: 800px)').matches) {
      return false;
    }
    return true;
  }


  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.sticky);
  }

  checkIsOwner(user: UserData) {
    if (user != null && this.currentCourse != null) {
      this.isOwner = this.currentCourse.ownerIds != null && this.currentCourse.ownerIds.includes(user.id) || user.roles.includes('ROLE_SUPER_ADMIN');
    } else {
      this.isOwner = false;
    }
  }
}
