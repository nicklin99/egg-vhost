'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async index() {
        const {
            ctx,
        } = this;
        ctx.body = 'v1';
    }

}

module.exports = IndexController;