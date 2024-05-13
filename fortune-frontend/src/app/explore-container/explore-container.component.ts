import { Component, Input } from '@angular/core';
import { StorageService } from '../services/storageService.js/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent {

  public name: string='';
  
  constructor(private router:Router,private storageService:StorageService){
      this.getUserInfo()
  }

  async getUserInfo(){
   const email=await this.storageService.getItem('email')
      this.name=email
      
  }


  logoutHandler(){
      this.storageService.clearStorage().then(()=>{
        this.router.navigate(['login'],{replaceUrl:true}).then(()=>{
          window.location.reload()
        })
        
      })
  }

}
