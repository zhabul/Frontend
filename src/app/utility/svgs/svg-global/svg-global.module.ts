
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddIconWithParamsSvgComponent } from '../add-icon-with-params-svg/add-icon-with-params-svg.component';
import { BackIconSvgComponent } from '../back-icon-svg/back-icon-svg.component';
import { CheckinWithStrokeComponent } from '../checkin-with-stroke/checkin-with-stroke.component';
import { CheckoutWithStrokeComponent } from '../checkout-with-stroke/checkout-with-stroke.component';
import { CleanSearchInputIconSvgComponent } from '../clean-search-input-icon-svg/clean-search-input-icon-svg.component';
import { DeleteIconComponent } from '../delete-icon/delete-icon.component';
import { FolderIconWithParamsSvgComponent } from '../folder-icon-with-params-svg/folder-icon-with-params-svg.component';
import { SearchIconWithParamsSvgComponent } from '../search-icon-with-params-svg/search-icon-with-params-svg.component';
import { ExclamationMarkSvgComponent } from '../exclamation-mark-svg/exclamation-mark-svg.component';
import { CommentWarningIconSvgComponent } from '../comment-warning-icon-svg/comment-warning-icon-svg.component';
@NgModule({
  declarations: [
    SearchIconWithParamsSvgComponent,
    FolderIconWithParamsSvgComponent,
    DeleteIconComponent,
    CleanSearchInputIconSvgComponent,
    CheckoutWithStrokeComponent,
    CheckinWithStrokeComponent,
    BackIconSvgComponent,
    AddIconWithParamsSvgComponent,
    ExclamationMarkSvgComponent,
    CommentWarningIconSvgComponent

  ],
  imports: [
    CommonModule
  ],
  exports: [SearchIconWithParamsSvgComponent,
    FolderIconWithParamsSvgComponent,
    DeleteIconComponent,
    CleanSearchInputIconSvgComponent,
    CheckoutWithStrokeComponent,
    CheckinWithStrokeComponent,
    BackIconSvgComponent,
    AddIconWithParamsSvgComponent,
    ExclamationMarkSvgComponent,
    CommentWarningIconSvgComponent
  ],
})
export class SvgGlobalModule { }
