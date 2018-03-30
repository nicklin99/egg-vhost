'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async index() {
        const {
            ctx,
        } = this;
        ctx.body = 'v2';
    }

}

module.exports = IndexController;