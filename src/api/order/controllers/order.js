'use strict';
const MobilPay = require('mobilpay-card')

/**
 * order controller
 */




const { createCoreController } = require('@strapi/strapi').factories;
const jwtdecode = require('jwt-decode');

module.exports = createCoreController('api::order.order', ({strapi}) => ({
    async create(ctx) {

        const { email,
            customerFirstName,
            customerLastName,
            products,
            street,
            city,
            county,
            phone,
            postalCode,
            finalPrice,
            account,
            usedVoucher,
            users_permissions_user,
            orderType} = ctx.request.body

        try{

            let orderAmmount = 0
            products.forEach((item) => {
                orderAmmount += item.quantity * item.price;
            });
       
            

            mobilPay.setClientBillingData({
                firstName: customerFirstName.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                lastName: customerLastName.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                county: county.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                city: city.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                address: street.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 
                email: email.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                phone: phone.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            });

            mobilPay.setPaymentData({
                orderId: Date.now().toString(),
                amount: finalPrice,
                currency: "RON",
                details: "Plata la ElectrikFum.ro",
                confirmUrl: "https://api.electrikfum.ro/api/orders/verifyPayment",
                returnUrl:  "https://electrikfum.ro/order",
            });


           let request = mobilPay.buildRequest(false);

            await strapi.entityService.create('api::order.order',{
                data:{
                    orderIdentifier: mobilPay.paymentData.order.$.id,
                    email,
                    customerFirstName,
                    customerLastName,
                    products,
                    street,
                    city,
                    county,
                    phone,
                    postalCode,
                    account,
                    usedVoucher,
                    orderType,
                    finalPrice,
                    users_permissions_user,
                    orderStatus: "pending"
                },
            });
            
            return request;

        }catch(err){
            ctx.response.status = 500;
            console.log(err)
            return err;
        }
     },
     async delivery(ctx) {

        const { email,
            customerFirstName,
            customerLastName,
            products,
            street,
            city,
            county,
            phone,
            postalCode,
            finalPrice,
            usedVoucher,
            users_permissions_user,
            orderType} = ctx.request.body

            let today = new Date().toLocaleDateString()



        try{

            let orderAmmount = 0
            products.forEach((item) => {
                orderAmmount += item.quantity * item.price;
            });

            const getItem = await Promise.all(
              products.map(async (product) => {
                  const item = await strapi.service("api::product.product").findOne(product.id, {});
                  await strapi.entityService.update("api::product.product",item.id,{
                      data:{
                          stock: item.stock - parseInt(product.quantity),
                      },
                  });
              })
          )

            const orderId = Date.now().toString();
            const emailTemplate = {
                subject: `Comanda ta la Electrikfum (#${orderId})`,
                text: 'Te rugăm sa vizionezi acest mail in html',
                html: `<img style=" padding-left: 4px;
                width: 200px;
            " src="https://www.electrikfum.ro/logo.svg" />
<h1>Îți mulțumim pentru <a href="https://electrikfum.ro/order?orderId=${orderId}">comanda ta</a>.</h1>
<table style="border-radius:1em;border-collapse:collapse;width:100%;border-top:1px solid #DDDDDD;border-left:1px solid #DDDDDD;margin-bottom:20px;">
  <thead>
    <tr>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;background-color:#EFEFEF;font-weight:bold;text-align:left;padding:7px;color:#222222;" colspan="2">Detaliile comenzii</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:left;padding:7px;">
        <b>ID:</b> ${orderId} <br>
        <b>Data adaugarii:</b> ${today} <br>
        <b>Metoda de plata:</b> Plata la livrare cash (numerar) <br>
        <b>Metoda de livrare:</b> Livrare la domiciliu
      </td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:left;padding:7px;">
        <b>E-mail:</b> ${email} <br>
        <b>Telefon:</b> ${phone} <br>
        <b>Status:</b> In curs de procesare <br>
      </td>
    </tr>
  </tbody>
</table>
<table style="border-radius:1em;border-collapse:collapse;width:100%;border-top:1px solid #DDDDDD;border-left:1px solid #DDDDDD;margin-bottom:20px;">
  <thead>
    <tr>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;background-color:#EFEFEF;font-weight:bold;text-align:left;padding:7px;color:#222222;">Adresa de facturare</td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;background-color:#EFEFEF;font-weight:bold;text-align:left;padding:7px;color:#222222;">Adresa de livrare</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:left;padding:7px;">Nume: ${customerFirstName} ${customerLastName} <br>Adresă: ${street} <br>Localitate: ${city} <br>Judet: ${county} <br>Cod Postal: ${postalCode} </td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:left;padding:7px;">Nume: ${customerFirstName} ${customerLastName} <br>Adresă: ${street} <br>Localitate: ${city} <br>Judet: ${county} <br>Cod Postal: ${postalCode} </td>
    </tr>
  </tbody>
</table>
<table style="border-radius:1em;border-collapse:collapse;width:100%;border-top:1px solid #DDDDDD;border-left:1px solid #DDDDDD;margin-bottom:20px;">
  <thead>
    <tr>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;background-color:#EFEFEF;font-weight:bold;text-align:left;padding:7px;color:#222222;">Produs</td>
      <td style="font-size:12px;border-right:0px solid #DDDDDD;border-bottom:0px solid #DDDDDD;background-color:#EFEFEF;font-weight:bold;text-align:left;padding:7px;color:#222222;"></td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;background-color:#EFEFEF;font-weight:bold;text-align:right;padding:7px;color:#222222;">Cantitate</td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;background-color:#EFEFEF;font-weight:bold;text-align:right;padding:7px;color:#222222;">Pret unitar</td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;background-color:#EFEFEF;font-weight:bold;text-align:right;padding:7px;color:#222222;">Pret total</td>
    </tr>
  </thead>
  <tbody> ${products?.map((item) => ( ` <tr>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:left;padding:7px;">${item.title}</td>
      <td style="font-size:12px;border-right:0px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;"></td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;">${item.quantity}</td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;">${item.price.toFixed(2)} RON</td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;">${item.quantity*item.price.toFixed(2)} RON</td>
    </tr> ` ) )} </tbody>
  <tfoot>
    <tr>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;" colspan="4">
        <b>Subtotal:</b>
      </td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;">${orderAmmount.toFixed(2)} RON</td>
    </tr> ${ orderAmmount < 250 ? ` <tr>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;" colspan="4">
        <b>Livrare la domiciliu:</b>
      </td>
      <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;">19.00 RON</td>
      </tr>` : `` } <tr>
        <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;" colspan="4">
          <b>Total:</b>
        </td>
        <td style="font-size:12px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;padding:7px;">${finalPrice.toFixed(2)} RON</td>
      </tr>
  </tfoot>
</table> `
              };

            await strapi.entityService.create('api::order.order',{
                data:{
                    orderIdentifier: orderId,
                    email,
                    customerFirstName,
                    customerLastName,
                    products,
                    street,
                    city,
                    county,
                    phone,
                    postalCode,
                    finalPrice,
                    usedVoucher,
                    users_permissions_user,
                    orderType,
                    orderStatus: "placed"
                },
            });

            await strapi.plugins['email'].services.email.sendTemplatedEmail(
                {
                  to: email,
                  // from: is not specified, the defaultFrom is used.
                },
                  emailTemplate,
              );


            return orderId;


        }catch(err){
            ctx.response.status = 500;
            console.log(err)
            return err;
        }
     },
     async verifyPayment(ctx) {

        try{
            
            const {env_key, data} = ctx.request.body





            let response = await mobilPay.validatePayment(env_key, data)

            const id = response.$.id;

            const entry = await strapi.entityService.findMany("api::order.order",{
                filters: {
                    orderIdentifier: {
                        $eq: id
                    }
                }
            })

           

            const realId = entry[0].id;

            console.log(response)
            
            if(response.error == null){
            switch(response.action){
                case 'confirmed':
                    await strapi.entityService.update("api::order.order",realId,{
                        data:{
                            orderStatus: "confirmed",
                        },
                    });
                    if(entry.status != "confirmed"){
                        
                        const getItem = await Promise.all(
                            entry[0].products.map(async (product) => {
                                const item = await strapi.service("api::product.product").findOne(product.id, {});
                                await strapi.entityService.update("api::product.product",item.id,{
                                    data:{
                                        stock: item.stock - parseInt(product.quantity),
                                    },
                                });
                            })
                        )
                    }
                    break;
                case 'paid':
                    console.log("paid")
                    break;
                case 'paid_pending':
                    console.log("pending")
                    break;
                case 'confirmed_pending':
                    console.log("confirmed_pending")
                    break;
            }
          }else{
            await strapi.entityService.update("api::order.order",realId,{
              data:{
                  orderStatus: "rejected",
              },
          });
            console.log("rejected")
          }
            ctx.response.type =  response.res.set.value;
            ctx.response.status = 200;
            ctx.response.body = response.res.send;
            
        }catch(err){
            ctx.response.status = 500;
            console.log(err)
            return err;
        }


    },
    async findOrder(ctx){

        const response = ctx.request.query

        const id = response.id


        const entry = await strapi.query('api::order.order').findMany({
                where: {
                    orderIdentifier: {
                        $eq: id,
                    },
                },
                populate: {
                    users_permissions_user :{
                        select: ['id'],
                    },
                },
        })  
        return entry
    },
    count(ctx){
        var {query} = ctx.request
        return strapi.query('api::order.order').count({where : query});
    },
    countUnhandled(ctx){
      var {query} = ctx.request
      return strapi.query('api::order.order').count(
        {where :{
        $and: [
        {
        orderStatus:{
          $not: 'delivered',
        },
        },
        {
          orderStatus:{
            $not: 'cancelled',
          },
        },
        {
          orderStatus:{
            $not: 'pending',
          },
        },
        {
          orderStatus:{
            $not: 'rejected',
          },
        }
  ],
}
});
  },
    fetch(ctx){
        var {query} = ctx.request
        console.log(query)
        return strapi.query('api::order.order').findMany({
            orderBy: {id: 'desc'},
            offset: query.offset,
            limit: 10});
    },
    fetchMy(ctx){
        var {query} = ctx.request
        let token = ctx.request.header.authorization.replace("Bearer ", "");
        let {id} = jwtdecode(token);
        if(id == query.id){
        ctx.response.status = 200;
        return strapi.entityService.findMany('api::order.order',{
            filters:{
                users_permissions_user:{
                            id:{
                                $eq: query.id
                    }
                }
            }
        });
    }else{
        ctx.response.status = 403;
    }
    },
   async update(ctx){


        if(ctx.request.body.data.orderStatus == "confirmed"){
            console.log(ctx.request.body.data.email)
            const emailConfirmed = {
                subject: `Actualizare comandă (#${ctx.request.body.data.orderIdentifier})`,
                text: 'Te rugăm sa vizionezi acest mail in html',
                html: `<img style=" padding-left: 4px;
                width: 200px;
            " src="https://www.electrikfum.ro/logo.svg" />
<h1>Informații noi despre comanda ta.</h1>
<p>Comanda cu numarul #${ctx.request.body.data.orderIdentifier} a fost actualizată cu statusul: <b> Comandă Confirmată</b></p>
<p>Dacă aveți orice neclarități sau doriți să anulați / modificați comanda nu ezitați sa dați reply la acest mail sau să ne apelați telefonic la numărul de pe site.</p>

<p>Vă mulțumim,</p><p>Echipa electrikfum.ro</p>
                  `};

                  await strapi.plugins['email'].services.email.sendTemplatedEmail(
                    {
                      to: ctx.request.body.data.email,
                      // from: is not specified, the defaultFrom is used.
                    },
                      emailConfirmed,
                  );

        }else if(ctx.request.body.data.orderStatus == "cancelled"){
            const emailCancelled = {
                subject: `Actualizare comandă (#${ctx.request.body.data.orderIdentifier})`,
                text: 'Te rugăm sa vizionezi acest mail in html',
                html: `<img style=" padding-left: 4px;
                width: 200px;
            " src="https://www.electrikfum.ro/logo.svg" />
<h1>Informații noi despre comanda ta.</h1>
<p>Comanda cu numarul #${ctx.request.body.data.orderIdentifier} a fost actualizată cu statusul: <b> Comandă Anulată</b></p>
<p>Dacă aveți orice neclarități sau doriți să anulați / modificați comanda nu ezitați sa dați reply la acest mail sau să ne apelați telefonic la numărul de pe site.</p>

<p>Vă mulțumim,</p><p>Echipa electrikfum.ro</p>
                  `};

                  await strapi.plugins['email'].services.email.sendTemplatedEmail(
                    {
                      to: ctx.request.body.data.email,
                      // from: is not specified, the defaultFrom is used.
                    },
                      emailCancelled,
                  );

        }else if(ctx.request.body.data.orderStatus == "delivered"){
            const emailDelivered = {
                subject: `Actualizare comandă (#${ctx.request.body.data.orderIdentifier})`,
                text: 'Te rugăm sa vizionezi acest mail in html',
                html: `<img style=" padding-left: 4px;
                width: 200px;
            " src="https://www.electrikfum.ro/logo.svg" />
<h1>Informații noi despre comanda ta.</h1>
<p>Comanda cu numarul #${ctx.request.body.data.orderIdentifier} a fost actualizată cu statusul: <b> Comandă Livrată</b></p>
<p>Dacă aveți orice neclarități sau doriți să anulați / modificați comanda nu ezitați sa dați reply la acest mail sau să ne apelați telefonic la numărul de pe site.</p>
<p>AWB: ${ctx.request.body.data.trackingNumber}</p>
<p>Vă mulțumim,</p><p>Echipa electrikfum.ro</p>
                  `};
                  await strapi.plugins['email'].services.email.sendTemplatedEmail(
                    {
                      to: ctx.request.body.data.email,
                      // from: is not specified, the defaultFrom is used.
                    },
                      emailDelivered,
                  );


        }


       return await strapi.entityService.update("api::order.order",ctx.request.body.id,{
        data:{
            orderStatus: ctx.request.body.data.orderStatus,
            trackingNumber: ctx.request.body.data.trackingNumber,
        },
        
    });
    }
}));
