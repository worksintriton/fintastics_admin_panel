import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'src/app/core/services/cookie.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { AdminModulesService } from 'src/app/core/services/admin/admin-modules.service';
import { AddEditTransactionTypeFormComponent } from '../add-edit-transaction-type-form/add-edit-transaction-type-form.component';

@Component({
  selector: 'app-edit-transaction-type',
  templateUrl: './edit-transaction-type.component.html',
  styleUrls: ['./edit-transaction-type.component.css']
})
export class EditTransactionTypeComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditTransactionTypeFormComponent,{ static: false })
  editForm: AddEditTransactionTypeFormComponent;
  user: User;
  private _id: any;
  
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EditTransactionTypeComponent>,
  private authService: AuthenticationService,
  private adminService:AdminModulesService,) { this.user = this.authService.currentUser();}

  ngOnInit() {
    var datas = this.data;
    this._id =this.data._id;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }

private fillForm(parsedData) {
  debugger
  this.editForm.addEditForm.patchValue({
    payment_type:parsedData.payment_type,
    delete_status:parsedData.delete_status
  
  });
}


public update() {
  debugger
  this.isShowErrors = true;
  if (this.editForm.addEditForm.valid) {
    const enteredData = this.editForm.addEditForm.value;
      enteredData._id = this.data._id;
      this.adminService.updatePaymentType(enteredData).subscribe(
        response => {
          this.success(response);
          this.dialogRef.close('Success');
        },
        (err: HttpErrorResponse) => {
          this.handleError(err.error.message);
        }
      )
    
  }
  else {
   
  }
}

private success(message) {
  Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message['Status'], icon: 'success', });
  this.dialogRef.close('Success'); 
 // this.alertService.success('Saved successfully');
}

private handleError(error) {
  Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.dialogRef.close('Success');
//  this.alertService.success(error);
}

reset() {
  this.editForm.addEditForm.reset();
}


}
