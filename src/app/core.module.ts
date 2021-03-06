import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LandingComponent} from './landing/landing.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatRippleModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {LayoutModule} from '@angular/cdk/layout';
import {MenuComponent} from './menu/menu.component';
import {MiddleComponent} from './middle/middle.component';
import {FooterComponent} from './footer/footer.component';
import {LessonComponent} from './lesson/lesson.component';
import {CoursePanelComponent} from './course/course-panel/course-panel.component';
import {CourseComponent} from './course/course.component';
import {CourseListComponent} from './course/course-list/course-list.component';
import {DocumentComponent} from './document/document.component';
import {CookieHandler} from './cookie-handler';
import {CookieService} from 'ngx-cookie-service';
import {CourseEditComponent} from './course/course-edit/course-edit.component';
import {QuestionComponent} from './question/question.component';
import {TestComponent} from './test/test.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ConcessionDialogComponent} from './course/course-list/concession-dialog/concession-dialog.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {AboutmeComponent} from './aboutme/aboutme.component';
import {DonateComponent} from './donate/donate.component';
import {RouterModule} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CKEditorModule} from 'ckeditor4-angular';
import {EscapeHtmlPipe} from './utils/keepHtmlPipe';
import {SelectComponent} from './question/select/select.component';
import {ErrorComponent} from './error/error.component';
import {GlobalErrorHandler} from './error/GlobalErrorHandler';
import {InputComponent} from './question/input/input.component';
import {NgxJsonLdModule} from "@ngx-lite/json-ld";
import {FacebookComponent} from './landing/facebook/facebook.component';
import {PolicyComponent} from './landing/policy/policy.component';
import {FieldErrorComponent} from './course/course-edit/field-error/field-error.component';
import {SearchComponent} from './search/search.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {CommentsComponent} from './comments/comments.component';
import {CommentComponent} from './comments/comment/comment.component';
import {FromNowPipe} from './comments/from-now.pipe';
import {UserNamePipe} from './comments/user-name.pipe';
import {UserPicPipe} from './comments/user-pic.pipe';
import { LoginComponent } from './auth/login/login.component';
import {SecurityModalComponent} from "./course/course-edit/security-modal/security-modal.component";
import { UserComponent } from './user/user.component';
import {MatListModule} from "@angular/material/list";
import { TestResultsComponent } from './test/test-results/test-results.component';
import {MatTabsModule} from "@angular/material/tabs";
import { TestInternalComponent } from './test/test-internal/test-internal.component';
import { CourseCardComponent } from './course/course-list/course-card/course-card.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TeacherComponent } from './teacher/teacher.component';
import { GroupListComponent } from './group/group-list/group-list.component';
import { GroupComponent } from './group/group.component';
import { CoursePureListComponent } from './course/course-list/course-pure-list/course-pure-list.component';
import { CourseListDialogComponent } from './course/course-list/course-list-dialog/course-list-dialog.component';
import { GroupResultsComponent } from './test/group-results/group-results.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    MenuComponent,
    MiddleComponent,
    FooterComponent,
    LessonComponent,
    CoursePanelComponent,
    CourseComponent,
    CourseListComponent,
    DocumentComponent,
    CourseEditComponent,
    QuestionComponent,
    TestComponent,
    ConcessionDialogComponent,
    AboutmeComponent,
    DonateComponent,
    EscapeHtmlPipe,
    SelectComponent,
    ErrorComponent,
    InputComponent,
    FacebookComponent,
    PolicyComponent,
    FieldErrorComponent,
    SearchComponent,
    CommentsComponent,
    CommentComponent,
    FromNowPipe,
    UserNamePipe,
    UserPicPipe,
    LoginComponent,
    SecurityModalComponent,
    UserComponent,
    TestResultsComponent,
    TestInternalComponent,
    CourseCardComponent,
    LoginPageComponent,
    TeacherComponent,
    GroupListComponent,
    GroupComponent,
    CoursePureListComponent,
    CourseListDialogComponent,
    GroupResultsComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    LayoutModule,
    DragDropModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSidenavModule,
    CKEditorModule,
    NgxDropzoneModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    RouterModule,
    CKEditorModule,
    NgxJsonLdModule,
    MatAutocompleteModule,
    MatListModule,
    MatTabsModule,
    MatRippleModule,
    MatProgressBarModule
  ],
  entryComponents: [
    ConcessionDialogComponent,
    SecurityModalComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CookieHandler,
    multi: true
  },
    CookieService,
    {provide: ErrorHandler, useClass: GlobalErrorHandler},],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class CoreModule {
}
