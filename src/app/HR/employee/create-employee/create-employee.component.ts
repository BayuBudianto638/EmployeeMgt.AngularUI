import {
    Component,
    Injector,
    OnInit,
    EventEmitter,
    Output
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { CreateEmployeeDto, EmployeeDto, EmployeeServiceProxy } from '../../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent extends AppComponentBase implements OnInit {
    saving = false;
    Employee = new EmployeeDto();

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private _employeeService: EmployeeServiceProxy,
        public bsModalRef: BsModalRef
    ) {
        super(injector);
    }

  ngOnInit(): void {
  }

    save(): void {
        this.saving = true;

        const employee = new CreateEmployeeDto();
        employee.init(this.Employee);
        console.log(this.Employee)

        this._employeeService
            .create(employee)
            .subscribe(
                () => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.bsModalRef.hide();
                    this.onSave.emit();
                },
                () => {
                    this.saving = false;
                }
            );
    }

}
