import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatTableAttributes, DateFormat } from "../../common/ui.constant";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material';
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { User } from "src/app/core/models/auth.models";
import { AdminModulesService } from "src/app/core/services/admin/admin-modules.service";
import { ExportToExcelService } from "src/app/core/services/exportExcel/export-to-excel.service";
import { Router } from "@angular/router";
import { AddTransactionDescriptionComponent } from "./add-transaction-description/add-transaction-description.component";
import { EditTransactionDescriptionComponent } from "./edit-transaction-description/edit-transaction-description.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class Product {
          desc_type:string;
          _id:string;
          delete_status:string;
          createdDate:string;
          updatedDate:string;
}
@Component({
  selector: 'app-transaction-description',
  templateUrl: './transaction-description.component.html',
  styleUrls: ['./transaction-description.component.css']
})
export class TransactionDescriptionComponent implements OnInit {
  @ViewChild('test1', { static: false }) content: ElementRef;
  testAttributesMap = new Map();
  public formGroup: FormGroup;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  error = '';
  userList:any;
  dynamicTableData: any[];
  user: User;
  dialogRef: any;
  
  constructor(private fb: FormBuilder,private router: Router,private adminService:AdminModulesService,private exportToExcelService: ExportToExcelService,public dialog: MatDialog)
   { }

  public displayedColumns: string[] = ['sno','desc_type','delete_status','createdDate',  'updatedDate','actions'];
  public displayedLabelColumns: string[] = ['serial No','description type','delete status','created Date',  'updated Date', 'actions'];
  dataSource: MatTableDataSource<Product>;

  ngOnInit() {
   this.getAllCustomer();
   var currentDate = new Date();
   var beforeMonthDate = currentDate.setMonth(currentDate.getMonth() - 1);
   this.formGroup = this.fb.group({
    startDate: [new Date(beforeMonthDate), Validators.required],
    endDate: [new Date(), Validators.required],

  });
  }

  filterDatasClearForm(){
    this.getAllCustomer();
  }

  submitData(){
    this.adminService.getDescriptionTypeFilterDatas(this.formGroup.value).pipe()
    .subscribe( data => {
        console.log("getFilterDatas ",data); 
        this.userList = data['Data'];
        this.loadRecord();
      },error => {
        this.error = error;
      });
  }

  getAllCustomer(){
    this.adminService.getTransactionDescriptionList().pipe()
    .subscribe( data => {
        console.log("data2 ",data); 
        this.userList = data['Data'];
        this.loadRecord();
      },error => {
        this.error = error;
      });
  }


  loadRecord() {
    debugger
    this.dynamicTableData = [];
    this.userList.forEach(element => {
      if(element.roll_type != "SuperAdmin"){
        let row: Product = {
          desc_type:element.desc_type,
          _id:element._id,    delete_status:element.delete_status && element.delete_status == true ?  "true" : "false" ,
          createdDate: element.createdAt,
          updatedDate: element.updatedAt,
        }
        this.dynamicTableData.push(row);
      }
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  public addRecord() {
    const dialogRef = this.dialog.open(AddTransactionDescriptionComponent, {
      width: '550px',
      height: 'fit-content',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Success') {
        this.getAllCustomer();
      }
    });
  }


  // exportAsXLSX(): void {
  //   let new_list = this.dataSource.filteredData.map(function(obj) {
  //     return {
  //       "User Name": obj.username,
  //       "User Email":obj.user_email,
  //       "User Phone":obj.user_phone,
  //       // "User Type":obj.user_type,
  //       "Created Date":new Date(obj.createdDate),
  //       "Updated Date":new Date(obj.updatedDate),
  //     }
  //   });
  //   this.exportToExcelService.exportAsExcelFile(new_list, "User Details",);
  // }


  public editRecord(items) {
    const dialogRef = this.dialog.open(EditTransactionDescriptionComponent, {
      width: '550px',
      height: 'fit-content',
      disableClose: true,
      data: {
        _id:items._id,
        desc_type:items.desc_type,
        delete_status:items.delete_status
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Success') {
        this.getAllCustomer();
      }
    });
  }

  public deleteRecord(recordId){
    debugger
    this.adminService.deleteDescription(recordId).pipe()
    .subscribe( data => {
        this.getAllCustomer();
      },error => {
        this.error = error;
      });
  }





}


