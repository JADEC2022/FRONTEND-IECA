import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PagesRoutingModule } from './pages.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CreateVacancyComponent } from './create-vacancy/create-vacancy.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { MyVacanciesComponent } from './my-vacancies/my-vacancies.component';
import { MaterialModule } from '../material.module';
import { ComponentsPagesModule } from './components/components-pages.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { UpdateVacancieComponent } from './update-vacancie/update-vacancie.component';
import { PostulateVacancyComponent } from './postulate-vacancy/postulate-vacancy.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SeeProfileComponent } from './see-profile/see-profile.component';
import { MyPostulationsComponent } from './my-postulations/my-postulations.component';
import { SeeCompanyComponent } from './see-company/see-company.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatiorItnl } from './pagination-es';
import { PaginatePipe } from './pipes/paginate.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { PostulationsComponent } from './postulations/postulations.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CompanyAdministratorComponent } from './company-administrator/company-administrator.component';
import { DashboardAdministratorComponent } from './dashboard-administrator/dashboard-administrator.component';
import { PerfilAdministratorComponent } from './perfil-administrator/perfil-administrator.component';
import { VacanciesAdministratorComponent } from './vacancies-administrator/vacancies-administrator.component';
import { NewAdministratorComponent } from './new-administrator/new-administrator.component';


@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        DashboardComponent,
        UserProfileComponent,
        CompanyProfileComponent,
        CreateVacancyComponent,
        VacanciesComponent,
        MyVacanciesComponent,
        UpdateVacancieComponent,
        PostulateVacancyComponent,
        FavoritesComponent,
        SeeProfileComponent,
        MyPostulationsComponent,
        SeeCompanyComponent,
        ReviewsComponent,
        PaginatePipe,
        SearchPipe,
        PostulationsComponent,
        NotificationsComponent,
        CompanyAdministratorComponent,
        DashboardAdministratorComponent,
        PerfilAdministratorComponent,
        VacanciesAdministratorComponent,

        NewAdministratorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PagesRoutingModule,
        ComponentsPagesModule,
        MaterialModule,
        GooglePlaceModule,
    ],
    providers: [
        {
            provide: MatPaginatorIntl,
            useClass: CustomMatPaginatiorItnl
        }
    ]
})

export class PagesModule {
}
