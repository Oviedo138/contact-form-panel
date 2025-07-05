// import { CanActivate, Router } from '@angular/router';
// import { Injectable } from "@angular/core";
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { take, switchMap } from 'rxjs/operators';
// import { getUserType, UserType } from '../enums/user_type.enum';

// @Injectable({
//     providedIn: 'root'
// })
// export class AdminGuard implements CanActivate {

//     constructor(private auth: AngularFireAuth, private router: Router) { }

//     canActivate() {
//         return this.auth.authState.pipe(
//             take(1),
//             switchMap(async (authState) => {
//                 if (!authState) { // check are user is logged in
//                     this.router.navigate(['/login'])
//                     return false
//                 }
//                 const token = await authState.getIdTokenResult()
//                 if (getUserType(token.claims['role']) != UserType.Administrador) { // check claims
//                     this.router.navigate(['/dashboard'])
//                     return false
//                 }
//                 return true
//             }),
//         )
//     }
// }
