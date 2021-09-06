import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {FileService} from '../../services/file.service';

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

  constructor(private formBuilder: FormBuilder, private fileService: FileService) {
  }

  loadParameters(): void {
    this.fileService.getFileFailPercent()
      .subscribe(percent => this.parametersForm.controls.fileFailPercentageControl.setValue(percent));
    this.fileService.getFileDelayMsec()
      .subscribe(delay => this.parametersForm.controls.fileDelayMsecControl.setValue(delay));
  }


  ngOnInit(): void {
    this.loadParameters();
    this.parametersForm.valueChanges.subscribe(() => {
      const percentValid = this.parametersForm.controls.fileFailPercentageControl.valid;
      const delayValid = this.parametersForm.controls.fileDelayMsecControl.valid;
      if (percentValid) {
        this.fileService.putFileFailPercent(this.parametersForm.controls.fileFailPercentageControl.value);
      }
      if (delayValid) {
        this.fileService.putFileDelayMsec(this.parametersForm.controls.fileDelayMsecControl.value);
      }
    });
  }

  refresh() {
    this.loadParameters();
    this.refreshEvent.emit();
  }
}
