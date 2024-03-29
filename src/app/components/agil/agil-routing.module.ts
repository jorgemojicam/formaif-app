import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalisisComponent } from './analisis/analisis.component';
import { AnalisisagroComponent } from './analisisagro/analisisagro.component';
import { FlujocajaComponent } from './flujocaja/flujocaja.component';
import { PropuestaComponent } from './propuesta/propuesta.component';
import { ResultadoComponent } from './resultado/resultado.component';
import { UbicacionComponent } from './ubicacion/ubicacion.component';
import { AgilComponent } from './agil.component';
import { BalanceComponent } from './balance/balance.component';
import { HomeComponent } from './home/home.component';
import { GastosComponent } from './gastos/gastos.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AgilComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'prefix',
        data: {
          routerName: 'home'
        }
      },
      {
        path: 'lobby',
        redirectTo: 'lobby',
        data: {
          routerName: 'lobby'
        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          routerName: 'home'
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'ubicacion',
        component: UbicacionComponent,
        data: {
          routerName: 'Ubicacion'
        }
      },
      {
        path: 'balance',
        data: {
          routerName: 'balance'
        },
        component: BalanceComponent
      },
      {
        path: 'gastos',
        component: GastosComponent,
        data: {
          routerName: 'gastos'
        }
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('./cruces/cruces.module').then(m => m.CrucesModule),
        data: {
          routerName: 'ventas'
        }

      },
      {
        path: 'analisis',
        component: AnalisisComponent,
        data: {
          routerName: 'analisis'
        }
      },
      {
        path: 'propuesta',
        component: PropuestaComponent,
        data: {
          routerName: 'propuesta'
        }
      },
      {
        path: 'flujocaja',
        component: FlujocajaComponent,
        data: {
          routerName: 'flujocaja'
        }
      },
      {
        path: 'analisisagro',
        component: AnalisisagroComponent,
        data: {
          routerName: 'analisisagro'
        }
      },
      {
        path: 'resultado',
        component: ResultadoComponent,
        data: {
          routerName: 'resultado'
        }
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgilRoutingModule { }
