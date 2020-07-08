import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
@Injectable({
    'providedIn': "root"
})
export class DataTableService {
    baseApiUrl:string;
    constructor(private http: HttpClient) { }
    getData(route) {
        return this.http.get(this.baseApiUrl+"/"+route);
    }
    editData(route,paramValue,data) {
        const endPoint=route.split(":")[0]
        return this.http.put(`${this.baseApiUrl}/${endPoint}${paramValue}`,data)
        .pipe(
            catchError(errorRes =>{
                return throwError(errorRes)
            })
        );
    }
    deleteData(route,paramValue) {
        const endPoint=route.split(":")[0]
        return this.http.delete(`${this.baseApiUrl}/${endPoint}${paramValue}`)
        .pipe(
            catchError(errorRes =>{
                return throwError(errorRes)
            })
        );;
    }
    createData(route,data){
        return this.http.post(`${this.baseApiUrl}/${route}`,data)
        .pipe(
            catchError(errorRes =>{
                return throwError(errorRes)
            })
        );;
    }
    
}