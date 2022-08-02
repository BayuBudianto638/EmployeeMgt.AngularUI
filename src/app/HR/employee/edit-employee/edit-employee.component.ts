import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { EmployeeDto, EmployeeEditDto, EmployeeServiceProxy } from '../../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent extends AppComponentBase implements OnInit {
    saving = false;
    id: number;
    Employee = new EmployeeEditDto();

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private _EmployeeService: EmployeeServiceProxy,
        public bsModalRef: BsModalRef
    ) {
        super(injector);
    }


    ngOnInit(): void {
        this._EmployeeService
            .get(this.id)
            .subscribe((result: EmployeeDto) => {
                this.Employee = result;
            });
    }

    save(): void {
        this.saving = true;

        const Employee = new EmployeeDto();
        Employee.init(this.Employee);

        this._EmployeeService.update(Employee).subscribe(
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
