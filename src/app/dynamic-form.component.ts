import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';
import { DropdownQuestion } from './question-dropdown';

type mrhFormValue = {
  firstname: string;
  emailAddress: string;
  brave: string;
  brave2: string;
};

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService],
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<string>[] | null = [];
  form!: FormGroup;
  payLoad = '';

  constructor(private qcs: QuestionControlService) {}

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[]);
    this.form.valueChanges.subscribe(this.removeOrAppendField);
  }

  removeOrAppendField = (formGroupResult: mrhFormValue) => {
    debugger;
    console.log(formGroupResult);
    if (
      formGroupResult.brave === 'good' &&
      !formGroupResult.hasOwnProperty('brave2')
    ) {
      console.log(this.questions);
      this.questions?.push(
        new DropdownQuestion({
          key: 'brave2',
          label: 'Bravery Rating2',
          options: [
            { key: 'solid', value: 'Solid' },
            { key: 'great', value: 'Great' },
            { key: 'good', value: 'Good' },
            { key: 'unproven', value: 'Unproven' },
          ],
          order: 2,
        })
      );
      this.questions?.sort((a, b) => a.order - b.order);
      console.log(this.questions);
      this.form.addControl('brave2', new FormControl(''), { emitEvent: false });
      console.log(this.form);
    } else {
      if (formGroupResult.brave !== 'good') {
        const controlToRemove = this.questions?.find(
          (question) => question.key === 'brave2'
        ) as QuestionBase<string>;
        const index = this.questions?.indexOf(controlToRemove);
        this.form.removeControl(controlToRemove.key, { emitEvent: false });
        if (index) this.questions?.splice(index, 1);
        console.log(controlToRemove);
        console.log(index);
      }
    }
  };

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
