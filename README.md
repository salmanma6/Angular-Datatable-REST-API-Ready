# Rest API Ready Angular Datatable

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.8.

## Features
  - #### Reusable component
  
    Use selector `<data-table>` tag in any component
  - #### Compatible with In Memory Web API and any REST API
    In order to use In Memory Web API set `inMemoryDatabase` to `true`  in both `environment.ts` and  `environment.prod.ts` and to use any other REST API set `inMemoryDatabase` to `false` 
``` typescript
export const environment = {
  production: false,
  inMemoryDatabase:true
};
``` 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Configure REST API endpoints  in options
```
{
   baseApiUrl: baseUrlhere,
   get: route to get records,
   edit: route to edit record,
   add: route to add record,
   delete: route to delete record,
   param: param(Ex:id) to pass in route,
   generateParamOnAdd:whether to create
                            new param(Ex:id) on every add(boolean),
     ... other options
}

//Example

{
    baseApiUrl: "http://localhost:5500/api",
    get: "employees",
    edit: "employees/:id",
    add: "employees",
    delete: "employees/:id",
    param:"id",
    generateParamOnAdd:true,
}
``` 
    
 - #### Basic CRUD Operations
    Add a record using Add button left to search bar.
   Edit and delete a record using buttons in Actions column of datatable
  - #### Formatting the data  
    Currently supports two formats `amount ` and `number`      
Format the data by passing property `format:"text"` in column object of columns array
Setting format to amount `3000` will convert  to `$3.00K`
   Setting format to number `3000`  will convert  to `3,000 `
```
{
...other options
dataTableOptions: {
columns: [
          { title: "Name", data: "employee_name", format: "text" },
          { title: "Age", data: "employee_age", format: "text" },
         { title: "Salary", data: "employee_salary", format: "amount"}
        ]
}
}        
```        

  - #### Supports Event callbacks  for ADD,EDIT and DELETE
  
    In order to execute something on respective events, pass property `eventCallbacks` with following json in the options which passed to `data-table`
 ```  
{
    ...other options
     eventCallbacks: {
        edited: function () {
          console.log("Record Edited")
        },
        added: function () {
          console.log("Record Added")
        },
        deleted: function () {
          console.log("Record Deleted")
        },
      }
}
```

## How to use the `data-table` component

##### Create a component using
``` bash
ng g c componentName
```

##### In Ts ,Create a property with any name (Ex:`customDtOptions`) and in `ngOnInit` initialize it as follows.
``` typescript

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  customDtOptions: any;
  constructor() { }
  ngOnInit(): void {
    this.customDtOptions = {
      baseApiUrl: "http://localhost:5500/api",
      get: "employees",
      edit: "employees/:id",
      add: "employees",
      delete: "employees/:id",
      param:"id",
      generateParamOnAdd:true,
      dataTableOptions: {
        columns: [
          { title: "Name", data: "employee_name", format: "text" },
          { title: "Age", data: "employee_age", format: "text" },
          { title: "Salary", data: "employee_salary", format: "amount"}
        ]
      },
      eventCallbacks: {
        edited: function () {
          console.log("Employee Edited")
        },
        added: function () {
          console.log("Employee Added")
        },
        deleted: function () {
          console.log("Employee Deleted")
        },
      }
    };
  }
}
```
##### In template(HTML) pass the options to customDtOptions property of `data-table` component
``` html
   <data-table  [customDtOptions]="customDtOptions" ></data-table>
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
