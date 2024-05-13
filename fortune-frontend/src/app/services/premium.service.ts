import { Injectable } from '@angular/core';
import { StorageService } from './storageService.js/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PremiumService {
public prem=''
  constructor(public storageService:StorageService) {
    this.getUserInfo()
   }

  async getUserInfo(){
    
    
       return this.storageService.getItem('prem')
       
   }
   async setPremium(){
    await this.storageService.setItem('prem',true)
    
    
                
   }

}
