import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

export type AlertType = 'Warning' | 'Error' | 'Success';

@Injectable({
  providedIn: 'root',
})
export class UAlertService {
  snackBarConfig: MatSnackBarConfig;
  snackBarRef: MatSnackBarRef<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  snackBarAutoHide = '2000';

  constructor(private snackBar: MatSnackBar) {}

  public setAlert(message: string, typ: AlertType) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = this.horizontalPosition;
    this.snackBarConfig.verticalPosition = this.verticalPosition;
    this.snackBarConfig.duration = parseInt(this.snackBarAutoHide, 0);
    if (typ == 'Error') {
      this.snackBarConfig.panelClass = 'snackbar-error';
    } else if (typ == 'Warning') {
      this.snackBarConfig.panelClass = 'snackbar-warning';
    } else if (typ == 'Success') {
      this.snackBarConfig.panelClass = 'snackbar-success';
    }
    this.snackBarRef = this.snackBar.open(message, '', this.snackBarConfig);
  }
}
