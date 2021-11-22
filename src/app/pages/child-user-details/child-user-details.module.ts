import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModules } from 'src/app/material.module';
import { ChildUserDetailsComponent } from './child-user-details.component';



@NgModule({
    declarations: [
        ChildUserDetailsComponent,
     
    ],
    exports: [ChildUserDetailsComponent],
    imports: [
        CommonModule,
        AppMaterialModules,
        FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
      
    ]

})

export class ChildUserDetailsModule { }