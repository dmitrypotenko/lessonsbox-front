import {AfterViewInit, Component, Injector, Input, OnInit} from '@angular/core';
import {QuestionType} from '../course/course-edit/QuestionType';
import {NgElement, WithProperties} from '@angular/elements';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, AfterViewInit {

  @Input() questionIndex: number;

  constructor(private sanitizer: DomSanitizer) {
  }

  safeQuestionHtml: SafeHtml;

  get questionData(): QuestionData {
    return this._questionData;
  }

  @Input()
  set questionData(value: QuestionData) {
    let style = '';
    let parsedQuestion = new DOMParser().parseFromString(value.question, 'text/html');
    let allEmbeddedElements: HTMLCollectionOf<Element> = parsedQuestion.body.getElementsByTagName('span');
    let i = 0;
    let fontSize = null;
    while (i < allEmbeddedElements.length) {
      let spanHtml = allEmbeddedElements[i] as HTMLElement;
      let elementFontSize = spanHtml.style.fontSize;
      if (elementFontSize != null && elementFontSize.length != 0) {
        fontSize = elementFontSize;
      }
      i++;
    }
    if (fontSize != null) {
      style = 'style=\'font-size: ' + fontSize + '\'';
    }
    this.safeQuestionHtml = this.sanitizer.bypassSecurityTrustHtml('<span ' + style + '>' + (this.questionIndex + 1) + '.&nbsp;</span>' +
      '<div>' + value.question + '</div>');


    this._questionData = value;
    let _this = this;
    setTimeout(function() {
      _this.runCustomQuestionDetection(value);
    }, 100);
  }

  private _questionData: QuestionData;


  ngOnInit() {

  }

  getFormattedAnswers() {
    let map = new Map<string, string[]>();
    this.questionData.variants.filter(option => !option.isTicked && option.isRight).forEach(option => {
      var rightOptions = map.get(option.inputName);
      if (rightOptions == null) {
        rightOptions = [];
        rightOptions.push('\"' + option.variant + '\"');
      } else {
        rightOptions.push('\"' + option.variant + '\"');
      }
      map.set(option.inputName, rightOptions);
    });

    let answers = Array.from(map.values()).map(value => value.join(' or ')).join(' | ');

    return answers;
  }

  ngAfterViewInit(): void {
    this.runCustomQuestionDetection(this._questionData);
  }

  runCustomQuestionDetection(question: QuestionData) {
    console.log('ngAfterViewChecked Start');
    let questionsSelector = document.querySelector('#question' + this.questionData.id);
    if (questionsSelector == null) {
      return;
    }
    let allSelects = questionsSelector.querySelectorAll('select-element,input-element') as NodeListOf<NgElement & WithProperties<{
      name: string,
      question: QuestionData
    }>>;
    allSelects.forEach(select => {
      console.log('ngAfterViewChecked');
      if (select.question == null) {
        select.question = question;
      }
    });
  }


  changeVariant(variant: VariantData) {
    this._questionData.variants.forEach(variant => {
      if (variant.isTicked) {
        variant.isTicked = false;
      }
    });
    variant.isTicked = true;
  }

  changeMultipleChoice(variant: VariantData) {
    variant.isTicked = !variant.isTicked;
  }

  notEmpty(explanation: string) {
    return explanation && explanation.trim();
  }
}

export class QuestionData {
  get type(): QuestionType {
    return this._type;
  }

  set type(type: QuestionType) {
    this._type = type;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  private _id: number;
  private _question: string;
  private _type: QuestionType;
  private _status: QuestionStatus;
  private _variants: VariantData[];


  constructor(question: string, variants: VariantData[], id: number, type: QuestionType, status: QuestionStatus = QuestionStatus.UNDEFINED) {
    this._question = question;
    this._variants = variants;
    this._id = id;
    this._type = type;
  }

  get question(): string {
    return this._question;
  }

  set question(value: string) {
    this._question = value;
  }

  get variants(): VariantData[] {
    return this._variants;
  }

  set variants(value: VariantData[]) {
    this._variants = value;
  }


  get status(): QuestionStatus {
    return this._status;
  }

  set status(value: QuestionStatus) {
    this._status = value;
  }

  toJSON() {
    const jsonObj = {};
    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      const hasGetter = desc && typeof desc.get === 'function';
      if (hasGetter) {
        jsonObj[key] = this[key];
      }
    }
    return jsonObj;
  }
}

export enum QuestionStatus {
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  UNDEFINED = 'UNDEFINED'
}

export class VariantData {
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  private _variant: string;
  private _explanation: string;
  private _isRight: boolean;
  private _isWrong: boolean;
  private _isTicked: boolean;
  private _id: number;
  private _inputName: string;
  private _inputType: string;


  constructor(variant: string, isRight: boolean, isWrong: boolean, isTicked: boolean, id: number, explanation: string, inputName: string,
              inputType: string) {
    this._variant = variant;
    this._isRight = isRight;
    this._isWrong = isWrong;
    this._isTicked = isTicked;
    this._id = id;
    this._explanation = explanation;
    this._inputName = inputName;
    this._inputType = inputType;
  }

  get variant(): string {
    return this._variant;
  }

  set variant(value: string) {
    this._variant = value;
  }

  get isRight(): boolean {
    return this._isRight;
  }

  set isRight(value: boolean) {
    this._isRight = value;
  }

  get isWrong(): boolean {
    return this._isWrong;
  }


  get inputName(): string {
    return this._inputName;
  }

  set inputName(value: string) {
    this._inputName = value;
  }


  get inputType(): string {
    return this._inputType;
  }

  set inputType(value: string) {
    this._inputType = value;
  }

  set isWrong(value: boolean) {
    this._isWrong = value;
  }

  get isTicked(): boolean {
    return this._isTicked;
  }

  set isTicked(value: boolean) {
    this._isTicked = value;
  }


  get explanation(): string {
    return this._explanation;
  }

  set explanation(value: string) {
    this._explanation = value;
  }

  toJSON() {
    const jsonObj = {};
    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      const hasGetter = desc && typeof desc.get === 'function';
      if (hasGetter) {
        jsonObj[key] = this[key];
      }
    }
    return jsonObj;
  }
}
