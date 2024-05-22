import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BASE_URL } from "./config/index";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, BASE_URL + "api/user/lang/", "");
}
