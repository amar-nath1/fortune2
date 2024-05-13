import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storageService.js/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
public leaderBoardArray:any=[]
public prem:any
  constructor(private cdr:ChangeDetectorRef,private storageService:StorageService,private apiService:ApiService) {}

  ionViewWillEnter(){
    this.checkIfPrem()
    this.LoadLeaderBoard()
  }
  async checkIfPrem(){
    const prem=await this.storageService.getItem('prem')
    this.prem=prem
    
  }

  sortLeaderBoard(arr:any){
        let sortedArr= arr.sort((a:any,b:any)=>b.amount-a.amount)
        return sortedArr
  }

async LoadLeaderBoard(){
    const token=await this.storageService.getItem('token')
      this.apiService.get('all-expense-users',token).subscribe((res:any)=>{
      
        // this.leaderBoardArray=this.sortLeaderBoard(res.result)
        this.leaderBoardArray=res.result
        console.log(this.leaderBoardArray,' allexpresuser')
      })
  }

  

}
