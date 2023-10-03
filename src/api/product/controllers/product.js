'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product',({strapi}) => ({
    count(ctx){
        var {query} = ctx.request
        return strapi.query('api::product.product').count({where : query});
    }
}));
