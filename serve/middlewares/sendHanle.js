const sendHandle = () => {
    return async (ctx, next) => {
       
        ctx.error = ({ data=null, msg, status,code=-200 }) => {
            ctx.status= status||401;
            ctx.body = { code, msg,data };
         }
        ctx.success = ({ data, msg }) => {
            ctx.body = { code: 200, msg, data };
        }
        await next();
    }
}

module.exports = sendHandle;