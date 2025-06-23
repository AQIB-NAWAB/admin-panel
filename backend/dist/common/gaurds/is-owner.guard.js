"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOwnerGuard = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../../product/product.service");
let IsOwnerGuard = class IsOwnerGuard {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        const id = req.params.id;
        if (!id)
            return true;
        try {
            await this.productService.findOne(id, user.id);
            return true;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw new common_1.ForbiddenException('You do not own this product');
            }
            throw err;
        }
    }
};
exports.IsOwnerGuard = IsOwnerGuard;
exports.IsOwnerGuard = IsOwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], IsOwnerGuard);
//# sourceMappingURL=is-owner.guard.js.map