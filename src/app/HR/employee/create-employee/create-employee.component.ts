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

    @Output() onSave = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private _employeeService: EmployeeServiceProxy,
        public bsModalRef: BsModalRef
    ) {
        super(injector);
    }

    ngOnInit(): void {       
        this.getGroup();
    }

    onShown(): void {
        //$.AdminBSB.input.activate($(this.modalContent.nativeElement));
        //$(this.birthDate.nativeElement).datetimepicker({
        //    locale: abp.localization.currentLanguage.name,
        //    format: 'L'
        //});
    }

    getGroup(): void {
        console.log("enter group");
        let groupsItem: Array<string>;
        groupsItem = ['Direktur', 'Manager', 'Supervisor'];
        this.groups = groupsItem;
    }

    save(): void {
        this.saving = true;
        console.log(this.Employee);
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
