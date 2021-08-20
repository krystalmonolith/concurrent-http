import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {FileService} from '../../services/file.service';
import {tap} from 'rxjs/operators';

const PERCENT_MIN = 0;
const PERCENT_MAX = 100;
const PERCENT_DEFAULT = 0;

const DELAY_MSEC_MIN = 0;
const DELAY_MSEC_MAX = 1000;
const DELAY_MSEC_DEFAULT = 50;

@Component({
  selector: 'app-parameter-form',
  templateUrl: './parameter-form.component.html',
  styleUrls: ['./parameter-form.component.scss']
})
export class ParameterFormComponent implements OnInit {

  @Output() refreshEvent = new EventEmitter();

  parametersForm = this.formBuilder.group({
    fileFailPercentageControl:
      new FormControl(PERCENT_DEFAULT,
        [Validators.required, Validators.min(PERCENT_MIN), Validators.max(PERCENT_MAX)]),
    fileDelayMsecControl:
      new FormControl(DELAY_MSEC_DEFAULT,
        [Validators.required, Validators.min(DELAY_MSEC_MIN), Validators.max(DELAY_MSEC_MAX)])
  });

  constructor(private formBuilder: FormBuilder, private fileService: FileService) { }

  ngOnInit(): void {
    this.fileService.getFileFailPercent().pipe(tap(v => console.log(`P: ${v}`))).subscribe(percent => this.parametersForm.controls.fileFailPercentageControl.setValue(percent));
    this.fileService.getFileDelayMsec().pipe(tap(v => console.log(`D: ${v}`))).subscribe(delay => this.parametersForm.controls.fileDelayMsecControl.setValue(delay));
    this.parametersForm.valueChanges.subscribe(v => {
      const formValid = this.parametersForm.valid;
      const percentValid = this.parametersForm.controls.fileFailPercentageControl.valid;
      const delayValid = this.parametersForm.controls.fileDelayMsecControl.valid;
      console.log(JSON.stringify(v,null,2) + ` Valid: ${formValid} FFPValid: ${percentValid} FDValid: ${delayValid}`);
      if (percentValid) {
        console.log(`PUTPERCENT: ${this.parametersForm.controls.fileFailPercentageControl.value}`)
        this.fileService.putFileFailPercent(this.parametersForm.controls.fileFailPercentageControl.value);
      }
      if (delayValid) {
        console.log(`PUTDELAY: ${this.parametersForm.controls.fileDelayMsecControl.value}`)
        this.fileService.putFileDelayMsec(this.parametersForm.controls.fileDelayMsecControl.value);
      }
    });
  }

  refresh() {
    this.refreshEvent.emit();
  }
}
