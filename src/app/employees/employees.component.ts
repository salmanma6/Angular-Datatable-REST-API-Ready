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
