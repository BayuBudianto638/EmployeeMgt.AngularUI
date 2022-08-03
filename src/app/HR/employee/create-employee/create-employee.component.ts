import {
    Component,
    Injector,
    OnInit,
    EventEmitter,
    Output,
    ElementRef,
    ViewChild
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
    @ViewChild('birthDate') birthDate: ElementRef;

    saving = false;
    Employee = new EmployeeDto();
    groups: Array<string>;

    maxDate = new Date();

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private _employeeService: EmployeeServiceProxy,
        public bsModalRef: BsModalRef
    ) {
        super(injector);
        this.maxDate.setDate(this.maxDate.getDate() + 7);
    }

    ngOnInit(): void {
        this.getGroup();
    }

    getGroup(): void {
        let groupsItem: Array<string>;
        groupsItem = ['Direktur', 'Manager', 'Supervisor'];
        this.groups = groupsItem;
    }

    format(date) {
        date = new Date(date);

        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        return month + '/' + day + '/' + year;
    }

    save(): void {
        this.saving = true;
        let birthDate =this.format(this.Employee.birthDate);
        this.Employee.birthDate = birthDate;

        let newDate = this.format(this.Employee.description);
        this.Employee.description = newDate;

        const employee = new CreateEmployeeDto();
        employee.init(this.Employee);

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
