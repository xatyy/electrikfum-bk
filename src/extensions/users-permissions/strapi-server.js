// path: src/extensions/users-permissions/strapi-server.js
const jwtdecode = require('jwt-decode');

module.exports = plugin => {
    const sanitizeOutput = (user) => {
      const {
        password, resetPasswordToken, confirmationToken, ...sanitizedUser
      } = user; // be careful, you need to omit other private attributes yourself
      return sanitizedUser;
    };
  
    plugin.controllers.user.me = async (ctx) => {
      if (!ctx.state.user) {
        return ctx.unauthorized();
      }
      const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        ctx.state.user.id,
        { populate: ['role'] }
      );
  
      ctx.body = sanitizeOutput(user);
    };
  
    plugin.controllers.user.find = async (ctx) => {
      const users = await strapi.entityService.findMany(
        'plugin::users-permissions.user',
        { ...ctx.params, populate: ['role'] }
      );
  
      ctx.body = users.map(user => sanitizeOutput(user));
    };

    plugin.controllers.user.update = async (ctx) => {
      const { email,
        firstName,
        lastName,
        phone,
        street,
        city,
        county,
        postalCode} = ctx.request.body

      let token = ctx.request.header.authorization.replace("Bearer ", "");
      let {id} = jwtdecode(token);
      if(ctx.state.user.role.id === 3){
      const users = await strapi.entityService.update(
        'plugin::users-permissions.user', ctx.params.id,
        { data:{
          email: email,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          street: street,
          city: city,
          county: county,
          postalCode: postalCode,
        } }
      );
      }else{
        const users = await strapi.entityService.update(
          'plugin::users-permissions.user', id,
          { data:{
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            street: street,
            city: city,
            county: county,
            postalCode: postalCode,
          } }
        );
      }
  
      ctx.body = true;
    };
  
    return plugin;
  };