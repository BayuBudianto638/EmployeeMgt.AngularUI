import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '../../../shared/paged-listing-component-base';
import { EmployeeDto, EmployeeDtoPagedResultDto, EmployeeServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
class PagedCityRequestDto extends PagedRequestDto {
    keyword: string;
}

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css'],
    animations: [appModuleAnimation()]
})
export class EmployeeComponent extends PagedListingComponentBase<EmployeeDto> implements OnInit {
    Employees: EmployeeDto[] = [];
    keyword = '';
    formatsDate: string[] = [
        'dd/MM/yyyy'
    ];
    dateNowISO: Date;

    constructor(injector: Injector,
        private _employeeService: EmployeeServiceProxy,
        private _modalService: BsModalService) { super(injector); }

    ngOnInit(): void {   
        this.refresh();
    }

    list(
        request: PagedCityRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        request.keyword = this.keyword;
        this._employeeService
            .getAll(request.keyword, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result: EmployeeDtoPagedResultDto) => {
                this.Employees = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    delete(employee: EmployeeDto): void {
        abp.message.confirm(
            this.l('CityDeleteWarningMessage', employee.userName),
            undefined,
            (result: boolean) => {
                if (result) {
                    this._employeeService
                        .delete(employee.id)
                        .pipe(
                            finalize(() => {
                                abp.notify.success(this.l('SuccessfullyDeleted'));
                                this.refresh();
                            })
                        )
                        .subscribe(() => { });
                }
            }
        );
    }

    createEmployee() {
        this.showCreateOrEditEmployeeDialog();
    }
    editEmployee(employee: EmployeeDto): void {
        this.showCreateOrEditEmployeeDialog(employee.id);
    }

    showCreateOrEditEmployeeDialog(id?: number): void {
        let createOrEditEmployeeDialog: BsModalRef;

        if (!id) {
            createOrEditEmployeeDialog = this._modalService.show(
                CreateEmployeeComponent,
                {
                    class: 'modal-lg',
                }
            );
        } else {
            createOrEditEmployeeDialog = this._modalService.show(
                EditEmployeeComponent,
                {
                    class: 'modal-lg',
                    initialState: {
                        id: id,
                    },
                }
            );
        }

        createOrEditEmployeeDialog.content.onSave.subscribe(() => {
            this.refresh();
        });
    }

}
