import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren:()=>import('./pages/login/login.module').then((m)=>m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path:'tabs',
    loadChildren:()=>import('./tabs/tabs.module').then(m=>m.TabsPageModule)
  },
  {
    path: 'password/resetpassword/:uuid',
    loadChildren: () => import('./pages/forgot-password/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  }
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
