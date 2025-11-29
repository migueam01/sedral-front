import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../environments/environment.development";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(authReq);
    }
    return next(req);
};