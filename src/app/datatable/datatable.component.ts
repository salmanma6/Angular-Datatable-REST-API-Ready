import { DataTableService } from './dataTable.service';
import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'data-table',
  styleUrls: ['./datatable.component.scss'],
  templateUrl: './datatable.component.html',
  providers: [DataTableService, DecimalPipe]
})

export class DataTableComponent implements OnDestroy, OnInit, AfterViewInit {

  @Input() customDtOptions: any;
  @ViewChild('addEditModal') addEditModalRef: ElementRef;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  primaryColumns: any;
  currentRecord: any;
  data: any;
  currentOperation: any;
  templateDataObject: any;
  showLoader=false;
  constructor(private dataTableService: DataTableService, private modalService: NgbModal
    , private decimalPipe: DecimalPipe, private toastr: ToastrService) { }

  ngOnInit(): void {
    const scope=this;
    this.showLoader=true;
    this.primaryColumns = [...this.customDtOptions.dataTableOptions.columns]
    const columnDefs = this.customDtOptions.dataTableOptions.columns.map((col, index) =>
      ({
        targets: index,
        className: "dt-center",
        render: (cellData, type, row) =>
          col.format == "text" ? cellData :
            col.format == "number" && !isNaN(cellData) ? this.decimalPipe.transform(cellData, '2.') :
              col.format == "amount" && !isNaN(cellData) ? "$" + this.decimalPipe.transform(cellData / 1000, '2.') + "K" : cellData
      }))
    columnDefs.push({
      targets: columnDefs.length,
      className: "dt-center",
      render: (data, type, row) => `<div class="d-flex justify-content-around">
                  <button type="button" id="editRecordBtn" class="btn btn-warning">Edit</button>
                  <button type="button" id="deleteRecordBtn" class="btn btn-danger">Delete</button>
             </div>`
      ,
      fnCreatedCell: (nTd, sData, oData, iRow, iCol) => {
        $(nTd).find("#editRecordBtn").on("click", () => this.openAddEditModal(iRow))
        $(nTd).find("#deleteRecordBtn").on("click", () => this.removeRecord(iRow))
      }
    });
    this.customDtOptions.dataTableOptions.columns.push({ "title": "Actions", data: null });
    this.dtOptions = {
      dom: 'lfr<"toolbar">tip',
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      responsive: true,
      autoWidth: true,
      initComplete: function () {
        $("div.toolbar").html(`<button type="button" id="addRecordBtn" class="btn btn-primary float-right px-2 py-1  mr-3" >Add New</button>`);
        $("div.toolbar").find("#addRecordBtn").on("click", () =>scope.openAddEditModal(-1));
      },
      ...this.customDtOptions.dataTableOptions,
      columnDefs: columnDefs
    }
    this.dataTableService.baseApiUrl = this.customDtOptions.baseApiUrl;
    this.getData();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  getData() {
    this.dataTableService.getData(this.customDtOptions.get).subscribe((res: any) => {
      this.data = res.data ? res.data : res;
      this.dtOptions.data = res.data ? res.data : res;
      this.templateDataObject ? "" : this.templateDataObject = Object.fromEntries(Object.keys(this.data[0]).map(key => [key, ""]))
      this.rerender();
    }, (err) => {
      console.log("Error Getting Records", err.message);
      this.toastr.error(err.message, 'Error Getting Records');
    })
  }

  openAddEditModal(iRow) {
    this.currentOperation = (iRow == -1) ? "Add" : "Edit";
    this.currentRecord = (iRow == -1) ? this.templateDataObject : this.data[iRow];
    this.modalService.open(this.addEditModalRef).result
      .then((result) => console.log("Modal closed"))
      .catch(err => "")
  }
  onAddEditFormSubmit(formValue) {
    this.showLoader=true;
    this.modalService.dismissAll();
    const prop = this.customDtOptions.param;
    const paramValue = this.currentRecord[prop];
    this.customDtOptions.generateParamOnAdd && this.currentOperation == "Add" ? this.currentRecord[prop] = new Date().getTime().toString() : ""
    const dataToSend = { ...this.currentRecord, ...formValue }
    this.currentOperation == "Add" ?
      this.dataTableService.createData(this.customDtOptions.add, dataToSend).subscribe((res) => {
        console.log(res);
        this.currentRecord = null;
        this.currentOperation = "";
        this.toastr.success('Record Added Successfully', 'Success');
        this.customDtOptions.eventCallbacks.added();
        this.getData();
      }, (err) => {
        console.log("Error Adding Record", err.message);
        this.toastr.error(err.message, 'Error Adding Record');
        this.currentRecord = null;
        this.currentOperation = "";
        this.showLoader=false;
      })
      :
      this.dataTableService.editData(this.customDtOptions.edit, paramValue, dataToSend).subscribe((res) => {
        console.log(res);
        this.currentRecord = null;
        this.currentOperation = "";
        this.toastr.success('Record Edited Successfully', 'Success');
        this.customDtOptions.eventCallbacks.edited();
        this.getData();
      }, (err) => {
        console.log("Error Editing Record", err.message);
        this.toastr.error(err.message, 'Error Editing Record');
        this.currentRecord = null;
        this.currentOperation = "";
        this.showLoader=false;
      })
  }

  removeRecord(iRow) {
    this.showLoader=true;
    this.currentRecord = this.data[iRow];
    const paramValue = this.currentRecord[this.customDtOptions.param];
    this.dataTableService.deleteData(this.customDtOptions.delete, paramValue).subscribe((res) => {
      console.log(res);
      this.currentRecord = null;
      this.currentOperation = "";
      this.toastr.success('Record Deleted Successfully', 'Success');
      this.customDtOptions.eventCallbacks.deleted();
      this.getData();

    }, (err) => {
      console.log("Error Deleting Record", err.message);
      this.toastr.error(err.message, 'Error Deleting Record');
      this.currentRecord = null;
      this.currentOperation = "";
      this.showLoader=false;
    })

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
      this.showLoader=false;
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

} 