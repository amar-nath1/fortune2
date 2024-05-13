import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { StorageService } from './storageService.js/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:4000';
  // private apiUrl = 'http://192.168.168.229:4000';
  // private apiUrl = 'http://52.62.18.183:4000';
  constructor(private storageService:StorageService,private http:HttpClient) {

   }

   

   get(endpoint:string,token?:any){
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':token
      }),
    };
    
    
      return this.http.get(`${this.apiUrl}/${endpoint}`,httpOptions)
   }

   post(endpoint:string,data:any,token?:any){

    const httpOptions:any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // or other content type as needed
        'Authorization':token
      }),
    };
    const httpOptionsAuth:any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // or other content type as needed
        
      }),
    };
    const header=token?httpOptions:httpOptionsAuth
   
    const payload=JSON.stringify(data)
    return this.http.post(`${this.apiUrl}/${endpoint}`,payload,header)
 }


 put(endpoint:string,data:any,token?:any){

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', // or other content type as needed
      'Authorization':token
    }),
  };
  const payload=JSON.stringify(data)
  return this.http.put(`${this.apiUrl}/${endpoint}`,payload,httpOptions)
}


 delete(endpoint:string,token:any){

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', // or other content type as needed
      'Authorization':token
    }),
  };

  return this.http.delete(`${this.apiUrl}/${endpoint}`,httpOptions)
}

}
