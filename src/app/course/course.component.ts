import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CourseData, CourseService} from '../course.service';
import {LessonData, LessonService} from '../lesson.service';
import {ActivatedRoute} from '@angular/router';
import {TestData, TestService} from '../test.service';
import {StepSwitcherService} from '../step-switcher.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {
  private courseService: CourseService;
  private lessonService: LessonService;
  private route: ActivatedRoute;
  currentCourse: CourseData;
  private stepSwitcher: StepSwitcherService;

  private cd: ChangeDetectorRef;
  private _testService: TestService;

  constructor(courseService: CourseService, lessonService: LessonService, route: ActivatedRoute,
              cd: ChangeDetectorRef,
              testService: TestService) {
    this.cd = cd;
    this.courseService = courseService;
    this.lessonService = lessonService;
    this.route = route;
    this._testService = testService;
  }

  ngOnInit() {
    let id: number = Number(this.route.snapshot.paramMap.get('id'));
    this.stepSwitcher = new StepSwitcherService(this.lessonService, this._testService);

    this.courseService.getCourseById(id).subscribe(course => this.currentCourse = course);
    this.lessonService.getLessonsFor(id).subscribe(lessons => {
      this.stepSwitcher.lessonsOfTheCourse = lessons;
    });
    this._testService.getTestsFor(id).subscribe(tests => {
      this.stepSwitcher.testsOfTheCourse = tests;
    });
  }

  ngAfterViewInit() {
    let ordered = this.stepSwitcher.ordered;
    if (ordered.length != 0) {
      this.stepSwitcher.switchTo(ordered[0]);
      this.cd.detectChanges();
    }
  }

  get currentLesson(): LessonData {
    return this.stepSwitcher.currentLesson;
  }

  get currentTest(): TestData {
    return this.stepSwitcher.currentTest;
  }
}