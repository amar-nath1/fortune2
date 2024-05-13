import { ChangeDetectorRef, Component } from '@angular/core';
import { ExpensesService } from '../services/expenses/expenses.service';
import { ApiService } from '../services/api.service';

import { StorageService } from '../services/storageService.js/storage.service';
import { PremiumService } from '../services/premium.service';
declare var Razorpay: any;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public cardNum = Math.floor(Math.random() * 1e10);
  public countCard = 1
  public rzp1 :any
  public premium='Go premium'
  public filterType='year'
  public allFileUrls=[]
  public page=0;
  public itemsPerPage='5';

  constructor(private cdr:ChangeDetectorRef,public premiumService:PremiumService,private storageService:StorageService,private apiService:ApiService,public expenseService:ExpensesService) {
    
    
  }

  increase(){
   if (this.countCard<5 &&this.countCard>0){
    this.countCard++
   }
  }

  decrease(){
    if (this.countCard<=5 &&this.countCard>1){
      this.countCard--
     }
  }

  ionViewWillEnter(){
    
    this.premiumService.getUserInfo().then((prm)=>{
      this.premium=prm===true?'you are premium':'Go premium'
      console.log(this.premium,'aafterset')
    })
    this.storageService.getItem('itemsPerPage').then((ipg)=>{
      
      this.itemsPerPage=ipg
      console.log(ipg,'ipddfgdfdggggg')
      this.expenseService.getAllExpense(this.filterType,false,this.page,Number(ipg))
    })
  }

  updateString() {
    // Update yourString here
    this.cdr.detectChanges(); // Trigger change detection
  }

  getPrevExpenses(){
    if(this.page>0){
      this.page-=Number(this.itemsPerPage)
      this.expenseService.getAllExpense(this.filterType,false,this.page,+this.itemsPerPage)
      
    }
    
  }

  getNextExpenses(){
    
    this.page+=Number(this.itemsPerPage)
      this.expenseService.getAllExpense(this.filterType,false,this.page,Number(this.itemsPerPage)) 
  }

  onFilterTypeChange(){
    this.expenseService.getAllExpense(this.filterType,false,this.page,+this.itemsPerPage)
  }

  onItemsPerPageChange(){
    this.storageService.setItem('itemsPerPage',this.itemsPerPage).then(()=>{
      this.expenseService.getAllExpense(this.filterType,false,this.page,Number(this.itemsPerPage))
    })
   
  }
  


  async goPremiumHandler(){
    if (this.premium!=='Go premium'){
      return
    }
    const token=await this.storageService.getItem('token')
    console.log(this.countCard,'couttttu')
    this.apiService.get(`go-premium?ct=${this.countCard}`,token).subscribe((res:any)=>{
      console.log(res,' get res')
      let options={
        key:res.key_id,
        order_id:res.order.id,
        handler: async (response:any)=>{
          const token=await this.storageService.getItem('token')
              this.apiService.put('go-premium',{status:'SUCCESS',orderid:options.order_id,paymentid:response.razorpay_payment_id,cardNum:this.cardNum,countCard:this.countCard},token).subscribe(async (payres)=>{
                console.log(payres,'payres')
                
                console.log(this.premium,'beforeset')
               this.premiumService.setPremium().then(()=>{
                
                  this.premium='you are premium'
                  this.updateString()
                  console.log(this.premium,'aafterset')
                
               })
               
              })
        },
        description: 'Payment for products/services',
        'theme':{
          color:'#0000FF'
        },
        prefill: {
          name: 'John Doe', // Replace with customer's name
          email: 'john.doe@example.com', // Replace with customer's email
          contact: '1234567890', // Replace with customer's phone number
        },
        notes: {
          address: 'Customer Address', // Replace with customer's address
        },
        
      }
      this.rzp1=new Razorpay(options)
      this.rzp1.open()
      this.rzp1.on('payment.failed',async (response:any)=>{
            console.log(response,' fail ho gya');
            const token=await this.storageService.getItem('token')
              this.apiService.put('go-premium',{status:'FAILED',orderid:options.order_id,paymentid:response.razorpay_payment_id},token).subscribe((payres)=>{
                console.log(payres,'payres')
              })
      })
    })
  }

  async deleteExpenseHandler(id:any){
    const token=await this.storageService.getItem('token')
    this.apiService.delete(`delete/${id}`,token).subscribe((res)=>{
      this.expenseService.getAllExpense(this.filterType)
    })
  }

  showDateLabel(i:any,j:any){
      if(!i){
        return true
      }
      else{
        if(!(i.createdAt.split('T')[0]===j.createdAt.split('T')[0])){
            return true
        }
        else return false
      }
  }

 async downloadDataHandler(){
  this.expenseService.getAllExpense(this.filterType,true)
  }

  async viewDownloadsHandler(){
    const token=await this.storageService.getItem('token')
    this.apiService.get('file-urls',token).subscribe((fileRes:any)=>{
      console.log(fileRes.urls,' allfileurlss')
      this.allFileUrls=fileRes.urls
    })
  }

}
